import type { Metadata } from "next";
import { LegalPage, Section, Field } from "@/components/legal/LegalPage";
import { getLegalSettings } from "@/lib/settings";
import { CONTACT_EMAIL, GA_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | Nagomi",
  alternates: { canonical: "/adatkezeles" },
};

export default async function AdatkezelesPage() {
  const s = await getLegalSettings();
  const contact = s.dpo_contact || CONTACT_EMAIL;
  return (
    <LegalPage
      title="Adatkezelési tájékoztató"
      intro="Ez a tájékoztató azt írja le, milyen személyes adatot kezel a Nagomi Pilates Studio weboldala, mire használja, kinek adja tovább, és milyen jogaid vannak."
    >
      <Section title="Adatkezelő">
        <p>
          <Field value={s.operator_name} />, székhely:{" "}
          <Field value={s.operator_address} />, adószám:{" "}
          <Field value={s.tax_number} />. Kapcsolat:{" "}
          <a className="underline underline-offset-4" href={`mailto:${contact}`}>
            {contact}
          </a>
          .
        </p>
      </Section>

      <Section title="Milyen adatokat kezelünk és mire">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Óra-foglalás:</strong> név, e-mail-cím, telefonszám, a
            választott óra és időpont, a fizetés módja és összege. Cél: a
            foglalás teljesítése, visszaigazolás, lemondás kezelése. Jogalap: a
            szerződés teljesítése (GDPR 6. cikk (1) b).
          </li>
          <li>
            <strong>Bérlet-vásárlás:</strong> név, e-mail-cím, telefonszám, a
            bérlet típusa, a fennmaradó alkalmak és a lejárat. Jogalap:
            szerződés teljesítése.
          </li>
          <li>
            <strong>Számlázás:</strong> a számlához szükséges név, e-mail-cím
            és az összeg. Jogalap: jogi kötelezettség (GDPR 6. cikk (1) c). A
            számviteli bizonylatokat a számvitelről szóló törvény szerint 8
            évig kell megőrizni.
          </li>
          <li>
            <strong>Kapcsolatfelvétel:</strong> ha e-mailben vagy telefonon
            megkeresel, a megkeresésben megadott adataidat a válaszadás
            idejéig, illetve az ügy lezárásáig kezeljük.
          </li>
          {GA_ID && (
            <li>
              <strong>Látogatottság-mérés (Google Analytics 4):</strong> csak a
              hozzájárulásoddal, a süti-sávban megadott döntés szerint. Jogalap:
              hozzájárulás (GDPR 6. cikk (1) a), amelyet bármikor
              visszavonhatsz a <a className="underline underline-offset-4" href="/suti">süti-oldalon</a>.
            </li>
          )}
        </ul>
      </Section>

      <Section title="Adatfeldolgozók és címzettek">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Stripe Payments Europe, Ltd.</strong> (Írország): a
            bankkártyás fizetés lebonyolítása. A kártyaadataidat nem mi
            kapjuk meg és nem tároljuk, azokat a Stripe kezeli.
          </li>
          <li>
            <strong>Resend</strong>: a visszaigazoló és értesítő e-mailek
            kiküldése.
          </li>
          <li>
            <strong>Számlázó szolgáltató:</strong> a számla kiállításához
            szükséges adatokat az éppen használt számlázó szolgáltatás kapja.
          </li>
          <li>
            <strong>Tárhelyszolgáltató:</strong> <Field value={s.hosting_provider} />
          </li>
        </ul>
      </Section>

      <Section title="Megőrzési idő">
        <p>
          A foglalási és bérlet-adatokat a szerződés teljesítéséhez szükséges
          ideig, a számlákat és a hozzájuk tartozó adatokat 8 évig őrizzük meg.
          Hozzájáruláson alapuló adatot a visszavonásig kezelünk.
        </p>
      </Section>

      <Section title="Jogaid">
        <p>
          Kérhetsz tájékoztatást a rólad kezelt adatokról, kérheted azok
          helyesbítését vagy törlését (a jogszabályi megőrzési kötelezettség
          alá eső adatok kivételével), korlátozását, kérheted az adatok
          hordozhatóságát, és tiltakozhatsz az adatkezelés ellen. A kéréseidet
          a fenti e-mail-címen várjuk, egy hónapon belül válaszolunk.
        </p>
      </Section>

      <Section title="Jogorvoslat">
        <p>
          Ha úgy érzed, az adataid kezelése sérti a jogaidat, panaszt tehetsz a
          Nemzeti Adatvédelmi és Információszabadság Hatóságnál (1055 Budapest,
          Falk Miksa utca 9-11., naih.hu), vagy bírósághoz fordulhatsz.
        </p>
      </Section>
    </LegalPage>
  );
}
