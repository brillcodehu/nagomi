export default function Footer() {
  return (
    <footer className="relative bg-foreground overflow-hidden">
      <div className="px-6 lg:px-16 py-12 md:py-16">
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
      </div>
    </footer>
  );
}
