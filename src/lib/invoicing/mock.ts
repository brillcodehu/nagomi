import type { InvoiceProvider } from "./types";

/** Fejlesztéshez és az E2E csomaghoz: nem hív külső szolgáltatást. */
export const mockProvider: InvoiceProvider = {
  name: "mock",
  async issue(order, ctx) {
    const year = new Date().getFullYear();
    const invoiceNumber = `MOCK-${year}-${String(ctx.seq).padStart(6, "0")}`;
    console.log(
      `[számlázás:mock] ${invoiceNumber} | ${order.customerEmail} | ${order.amountHuf} Ft | ${order.description}`
    );
    return { ok: true, invoiceNumber, providerRef: `mock-${order.sessionId}` };
  },
  async storno(invoiceNumber) {
    console.log(`[számlázás:mock] sztornó: ${invoiceNumber}`);
    return { ok: true, invoiceNumber: `${invoiceNumber}-ST` };
  },
};
