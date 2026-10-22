import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { mockProvider } from "./mock";
import { szamlazzProvider } from "./szamlazz";
import type { InvoiceOrder, InvoiceProvider } from "./types";

export type { InvoiceOrder, InvoiceProvider } from "./types";

/** INVOICE_PROVIDER=mock (alap) vagy szamlazz. */
export function getInvoiceProvider(): InvoiceProvider {
  const name = process.env.INVOICE_PROVIDER?.trim().toLowerCase();
  return name === "szamlazz" ? szamlazzProvider : mockProvider;
}

/**
 * Számla kiállítása egy fizetett rendelésről. Idempotens: egy Stripe
 * session + fajta párra pontosan egy sor lehet az invoices táblában, az
 * újrapróbált webhook nem állít ki második számlát. Hibás (failed) sor
 * újrapróbálásra újra kiállítható. Soha nem dob hibát: a webhook nem
 * bukhat el a számlázáson.
 */
export async function issueInvoice(order: InvoiceOrder) {
  try {
    const provider = getInvoiceProvider();

    const inserted = await db
      .insert(invoices)
      .values({
        stripeCheckoutSessionId: order.sessionId,
        kind: order.kind,
        bookingId: order.bookingId ?? null,
        customerPassId: order.customerPassId ?? null,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        description: order.description,
        amountHuf: order.amountHuf,
        provider: provider.name,
        status: "pending",
      })
      .onConflictDoNothing()
      .returning();

    let row = inserted[0];
    if (!row) {
      const [existing] = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.stripeCheckoutSessionId, order.sessionId),
            eq(invoices.kind, order.kind)
          )
        )
        .limit(1);
      // Kiállított vagy éppen folyamatban lévő számlát nem nyúlunk újra.
      if (!existing || existing.status !== "failed") return existing ?? null;
      // Atomikus átvétel: csak az az újrapróbálkozó folytatja, amelyik a
      // failed -> pending átmenetet megnyerte.
      const [claimed] = await db
        .update(invoices)
        .set({ status: "pending", error: null, provider: provider.name })
        .where(and(eq(invoices.id, existing.id), eq(invoices.status, "failed")))
        .returning();
      if (!claimed) return existing;
      row = claimed;
    }

    const result = await provider.issue(order, { seq: row.seq });
    const [updated] = await db
      .update(invoices)
      .set(
        result.ok
          ? {
              status: "issued",
              invoiceNumber: result.invoiceNumber,
              providerRef: result.providerRef ?? null,
              error: null,
            }
          : { status: "failed", error: result.error }
      )
      .where(eq(invoices.id, row.id))
      .returning();
    if (!result.ok) console.error("Számla kiállítása sikertelen:", result.error);
    return updated;
  } catch (error) {
    console.error("Számlázási hiba:", error);
    return null;
  }
}

/** A foglaláshoz kiállított számla sztornózása (visszatérítéskor). */
export async function stornoInvoiceForBooking(bookingId: string) {
  try {
    const [row] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.bookingId, bookingId), eq(invoices.status, "issued")))
      .limit(1);
    if (!row || !row.invoiceNumber) return null;

    const provider = getInvoiceProvider();
    const result = await provider.storno(row.invoiceNumber);
    if (!result.ok) {
      console.error("Számla sztornózása sikertelen:", result.error);
      await db
        .update(invoices)
        .set({ error: `Sztornó sikertelen: ${result.error}` })
        .where(eq(invoices.id, row.id));
      return null;
    }
    const [updated] = await db
      .update(invoices)
      .set({ status: "stornoed", error: null })
      .where(eq(invoices.id, row.id))
      .returning();
    return updated;
  } catch (error) {
    console.error("Sztornózási hiba:", error);
    return null;
  }
}
