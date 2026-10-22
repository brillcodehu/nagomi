import Link from "next/link";
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";
import { GA_ID, ADDRESS, CONTACT_EMAIL, PHONE, PHONE_HREF } from "@/lib/site";

export default function Footer() {
  const [addressCity, ...addressRest] = ADDRESS.split(", ");
  const addressStreet = addressRest.join(", ");
  const linkClass =
    "text-[12px] text-background/75 hover:text-background/90 font-light tracking-wide transition-colors duration-400 underline underline-offset-4";
  return (
    <footer className="relative bg-foreground overflow-hidden">
      <div className="px-6 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-10">
        <p className="font-[family-name:var(--font-playfair)] text-background/25 text-[clamp(1.1rem,2.5vw,1.6rem)] font-light tracking-wide leading-[1.6] md:leading-none text-center">
          <span className="md:hidden">
            {addressCity}
            {addressStreet && (
              <>
                <br />
                {addressStreet}
              </>
            )}
          </span>
          <span className="hidden md:inline">{ADDRESS}</span>
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-background/[0.06] to-transparent mt-8 md:mt-10 mb-6" />

        <div className="flex items-center justify-between">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[12px] text-background/75 hover:text-background/90 font-light tracking-wide transition-colors duration-400"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={PHONE_HREF}
            className="text-[12px] text-background/75 hover:text-background/90 font-light tracking-wide transition-colors duration-400"
          >
            {PHONE}
          </a>
        </div>

        <nav
          aria-label="Jogi tájékoztatók"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          <Link href="/impresszum" className={linkClass}>
            Impresszum
          </Link>
          <Link href="/adatkezeles" className={linkClass}>
            Adatkezelés
          </Link>
          <Link href="/suti" className={linkClass}>
            Sütik
          </Link>
          {GA_ID && (
            <CookieSettingsButton className={linkClass}>
              Süti-beállítások
            </CookieSettingsButton>
          )}
        </nav>
      </div>
    </footer>
  );
}
