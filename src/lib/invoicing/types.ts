/** Egy fizetett rendelés, amelyről számlát kell kiállítani. */
export interface InvoiceOrder {
  /** A Stripe Checkout Session azonosítója: ez az idempotencia-kulcs. */
  sessionId: string;
  kind: "class_booking" | "pass_purchase";
  bookingId?: string;
  customerPassId?: string;
  customerName: string;
  customerEmail: string;
  /** A számla tételének megnevezése. */
  description: string;
  /** Bruttó összeg forintban. */
  amountHuf: number;
}

export type IssueResult =
  | { ok: true; invoiceNumber: string; providerRef?: string }
  | { ok: false; error: string };

export type StornoResult =
  | { ok: true; invoiceNumber?: string; providerRef?: string }
  | { ok: false; error: string };

export interface InvoiceProvider {
  readonly name: "mock" | "szamlazz";
  /** `seq` az invoices tábla sorszáma: a mock ebből képez számlaszámot. */
  issue(order: InvoiceOrder, ctx: { seq: number }): Promise<IssueResult>;
  /** Sztornó a kiállított számla számával. */
  storno(invoiceNumber: string): Promise<StornoResult>;
}
