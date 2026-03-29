export default function Footer() {
  return (
    <footer className="relative bg-foreground overflow-hidden">
      <div className="px-6 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-10">
        <p className="font-[family-name:var(--font-playfair)] text-background/25 text-[clamp(1.1rem,2.5vw,1.6rem)] font-light tracking-wide leading-[1.6] md:leading-none text-center">
          <span className="md:hidden">
            Debrecen-Józsa,
            <br />
            Deák Ferenc utca 2.
          </span>
          <span className="hidden md:inline">
            Debrecen-Józsa, Deák Ferenc utca 2.
          </span>
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-background/[0.06] to-transparent mt-8 md:mt-10 mb-6" />

        <div className="flex items-center justify-between">
          <a
            href="mailto:talk@nagomi-pilates.hu"
            className="text-[12px] text-background/75 hover:text-background/90 font-light tracking-wide transition-colors duration-400"
          >
            talk@nagomi-pilates.hu
          </a>
          <a
            href="tel:+36304114071"
            className="text-[12px] text-background/75 hover:text-background/90 font-light tracking-wide transition-colors duration-400"
          >
            +36 30 411 4071
          </a>
        </div>
      </div>
    </footer>
  );
}
