import type { Metadata } from "next";
import { LegalPage, Section, Field } from "@/components/legal/LegalPage";
import { getLegalSettings } from "@/lib/settings";
import { ADDRESS, CONTACT_EMAIL, PHONE, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Impresszum | Nagomi",
  alternates: { canonical: "/impresszum" },
};

export default async function ImpresszumPage() {
  const s = await getLegalSettings();
  return (
    <LegalPage
      title="Impresszum"
      intro={`A ${SITE_NAME} weboldalának (${SITE_URL.replace("https://", "")}) üzemeltetési adatai.`}
    >
      <Section title="Üzemeltető">
        <dl className="grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-3">
          <dt className="font-medium text-foreground">Név</dt>
          <dd><Field value={s.operator_name} /></dd>
          <dt className="font-medium text-foreground">Székhely</dt>
          <dd><Field value={s.operator_address} /></dd>
          <dt className="font-medium text-foreground">Adószám</dt>
          <dd><Field value={s.tax_number} /></dd>
          <dt className="font-medium text-foreground">Nyilvántartási szám</dt>
          <dd><Field value={s.registration_number} /></dd>
        </dl>
      </Section>

      <Section title="Stúdió és elérhetőség">
        <dl className="grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-3">
          <dt className="font-medium text-foreground">Stúdió címe</dt>
          <dd>{ADDRESS}</dd>
          <dt className="font-medium text-foreground">E-mail</dt>
          <dd>
            <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </dd>
          <dt className="font-medium text-foreground">Telefon</dt>
          <dd>{PHONE}</dd>
        </dl>
      </Section>

      <Section title="Tárhelyszolgáltató">
        <p>
          <Field value={s.hosting_provider} />
        </p>
      </Section>

      <Section title="Adatkezelés és sütik">
        <p>
          A személyes adatok kezeléséről az{" "}
          <a className="underline underline-offset-4" href="/adatkezeles">
            adatkezelési tájékoztató
          </a>{" "}
          szól, a sütik használatáról a{" "}
          <a className="underline underline-offset-4" href="/suti">
            süti-tájékoztató
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
