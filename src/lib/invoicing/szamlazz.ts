import type { InvoiceOrder, InvoiceProvider } from "./types";

/**
 * Számlázz.hu Számla Agent: VÁZ. Éles kulccsal és a Számlázz.hu fiók
 * beállításainak (ÁFA-státusz, számlatömb, e-számla) ismeretében kell
 * ellenőrizni, ez még sosem futott éles kulccsal.
 *
 * Env: SZAMLAZZ_AGENT_KEY (kötelező), SZAMLAZZ_VAT (alap: AAM),
 * SZAMLAZZ_ESZAMLA (true/false, alap: true).
 * Kulcs nélkül minden hívás hibát ad vissza; a rendszer nem vált csendben mockra.
 */

const ENDPOINT = "https://www.szamlazz.hu/szamla/";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function agentKey(): string | null {
  return process.env.SZAMLAZZ_AGENT_KEY?.trim() || null;
}

export function buildIssueXml(order: InvoiceOrder, key: string): string {
  const vat = (process.env.SZAMLAZZ_VAT?.trim() || "AAM").toUpperCase();
  const isAam = vat === "AAM";
  const pct = isAam ? 0 : parseInt(vat, 10) || 0;
  const brutto = order.amountHuf;
  const netto = isAam ? brutto : Math.round(brutto / (1 + pct / 100));
  const afa = brutto - netto;
  const eszamla = process.env.SZAMLAZZ_ESZAMLA?.trim() !== "false";
  const today = new Date().toISOString().slice(0, 10);

  return `<?xml version="1.0" encoding="UTF-8"?>
<xmlszamla xmlns="http://www.szamlazz.hu/xmlszamla" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.szamlazz.hu/xmlszamla https://www.szamlazz.hu/szamla/docs/xsds/agent/xmlszamla.xsd">
<beallitasok><szamlaagentkulcs>${esc(key)}</szamlaagentkulcs><eszamla>${eszamla}</eszamla><szamlaLetoltes>false</szamlaLetoltes></beallitasok>
<fejlec><keltDatum>${today}</keltDatum><teljesitesDatum>${today}</teljesitesDatum><fizetesiHataridoDatum>${today}</fizetesiHataridoDatum><fizmod>bankkártya</fizmod><penznem>HUF</penznem><szamlaNyelve>hu</szamlaNyelve><megjegyzes>Stripe: ${esc(order.sessionId)}</megjegyzes><fizetve>true</fizetve></fejlec>
<elado></elado>
<vevo><nev>${esc(order.customerName)}</nev><irsz></irsz><telepules></telepules><cim></cim><email>${esc(order.customerEmail)}</email><sendEmail>${eszamla}</sendEmail></vevo>
<tetelek><tetel><megnevezes>${esc(order.description)}</megnevezes><mennyiseg>1</mennyiseg><mennyisegiEgyseg>db</mennyisegiEgyseg><nettoEgysegar>${netto}</nettoEgysegar><afakulcs>${isAam ? "AAM" : pct}</afakulcs><nettoErtek>${netto}</nettoErtek><afaErtek>${afa}</afaErtek><bruttoErtek>${brutto}</bruttoErtek></tetel></tetelek>
</xmlszamla>`;
}

export function buildStornoXml(invoiceNumber: string, key: string): string {
  const eszamla = process.env.SZAMLAZZ_ESZAMLA?.trim() !== "false";
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<xmlszamlast xmlns="http://www.szamlazz.hu/xmlszamlast" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.szamlazz.hu/xmlszamlast https://www.szamlazz.hu/szamla/docs/xsds/agentst/xmlszamlast.xsd">
<beallitasok><szamlaagentkulcs>${esc(key)}</szamlaagentkulcs><eszamla>${eszamla}</eszamla><szamlaLetoltes>false</szamlaLetoltes></beallitasok>
<fejlec><szamlaszam>${esc(invoiceNumber)}</szamlaszam><keltDatum>${today}</keltDatum><tipus>SS</tipus></fejlec>
</xmlszamlast>`;
}

async function post(field: string, xml: string) {
  const fd = new FormData();
  fd.append(field, new Blob([xml], { type: "text/xml" }), "szamla.xml");
  let res: Response;
  try {
    res = await fetch(ENDPOINT, { method: "POST", body: fd });
  } catch {
    return { ok: false as const, error: "A Számlázz.hu nem érhető el" };
  }
  const errCode = res.headers.get("szlahu_error_code");
  if (errCode && errCode !== "0") {
    const msg = res.headers.get("szlahu_error");
    return {
      ok: false as const,
      error: msg
        ? decodeURIComponent(msg.replace(/\+/g, " "))
        : `Számlázási hiba (${errCode})`,
    };
  }
  return { ok: true as const, invoiceNumber: res.headers.get("szlahu_szamlaszam") ?? "" };
}

export const szamlazzProvider: InvoiceProvider = {
  name: "szamlazz",
  async issue(order) {
    const key = agentKey();
    if (!key) return { ok: false, error: "Számlázz.hu nincs beállítva (SZAMLAZZ_AGENT_KEY hiányzik)" };
    const result = await post("action-xmlagentxmlfile", buildIssueXml(order, key));
    if (!result.ok) return result;
    return { ok: true, invoiceNumber: result.invoiceNumber, providerRef: result.invoiceNumber };
  },
  async storno(invoiceNumber) {
    const key = agentKey();
    if (!key) return { ok: false, error: "Számlázz.hu nincs beállítva (SZAMLAZZ_AGENT_KEY hiányzik)" };
    const result = await post("action-szamla_agent_st", buildStornoXml(invoiceNumber, key));
    if (!result.ok) return result;
    return { ok: true, invoiceNumber: result.invoiceNumber || undefined };
  },
};
