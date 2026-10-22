import Link from "next/link";
import Footer from "@/components/Footer";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main id="main" className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/"
            className="inline-block text-[12px] tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground mb-10 underline underline-offset-4"
          >
            Vissza a főoldalra
          </Link>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-foreground mb-6">
            {title}
          </h1>
          {intro && (
            <p className="text-foreground/80 leading-relaxed mb-10">{intro}</p>
          )}
          <div className="legal-body space-y-8 text-foreground/85 leading-relaxed">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** Hiányzó adat: látható, felismerhető jelzés, soha nem kitalált érték. */
export function Field({ value }: { value: string }) {
  if (value) return <>{value}</>;
  return (
    <span
      data-missing="true"
      className="inline-block rounded-[4px] border border-dashed border-[#8B4513] bg-[#8B4513]/10 px-2 py-0.5 text-[#6B3410] text-sm font-medium"
    >
      megadandó
    </span>
  );
}
