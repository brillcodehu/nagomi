import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal/LegalPage";
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";
import { GA_ID } from "@/lib/site";

export const metadata: Metadata = {
  title: "Süti-tájékoztató | Nagomi",
  alternates: { canonical: "/suti" },
};

export default function SutiPage() {
  return (
    <LegalPage
      title="Süti-tájékoztató"
      intro="A süti egy kis szövegfájl, amelyet a böngésződ a weboldal kérésére tárol. Itt van felsorolva, mely sütiket használja ez az oldal."
    >
      <Section title="Feltétlenül szükséges sütik">
        <p>
          A belépéshez szükséges munkamenet-süti (next-auth) csak az admin
          felületen, a stúdió munkatársainak belépésekor keletkezik. A
          látogatók számára az oldal nem tesz le szükséges sütit, a süti-sáv
          döntésedet a böngésző helyi tárolója jegyzi meg (nagomi-consent).
        </p>
      </Section>

      <Section title="Mérési sütik">
        {GA_ID ? (
          <>
            <p>
              Google Analytics 4 (_ga, _ga_*): a látogatottság névtelenített
              mérése. Csak akkor töltődik be, ha a süti-sávban elfogadtad. A
              Consent Mode miatt a döntésed előtt semmilyen mérési süti nem
              keletkezik.
            </p>
            <CookieSettingsButton />
          </>
        ) : (
          <p>
            Jelenleg az oldal nem használ mérési vagy marketing sütit, ezért
            süti-sáv sincs.
          </p>
        )}
      </Section>

      <Section title="Harmadik fél">
        <p>
          A bankkártyás fizetés a Stripe oldalán történik, amelynek saját
          süti- és adatkezelési szabályai vannak.
        </p>
      </Section>
    </LegalPage>
  );
}
