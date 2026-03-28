"use client";

const footerLinks = [
  { label: "Rólunk", href: "#rolunk" },
  { label: "Óráink", href: "#orak" },
  { label: "Órarend", href: "#idopontok" },
  { label: "Vélemények", href: "#velemenyek" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

const legalLinks = [
  "Adatvédelmi tájékoztató",
  "Általános Szerződési Feltételek",
  "Cookie beállítások",
];

export default function Footer() {
  return (
    <footer className="relative bg-foreground py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="#" className="inline-block mb-5">
              <span className="font-[family-name:var(--font-playfair)] text-[22px] font-bold tracking-[0.08em] text-background/90">
                NAGOMI
              </span>
            </a>
            <p className="text-background/25 font-light max-w-sm leading-relaxed text-[14px]">
              Premium pilates stúdió Budapesten. Fedezd fel a belső nyugalmadat
              és találj rá az egyensúlyodra.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-background/20 font-medium mb-6">
              Navigáció
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-background/35 hover:text-secondary transition-colors duration-400 text-[13px] font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-background/20 font-medium mb-6">
              Jogi
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-background/35 hover:text-secondary transition-colors duration-400 text-[13px] font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/15 text-[11px] tracking-wider font-light">
            &copy; {new Date().getFullYear()} Nagomi Pilates Studio. Minden jog
            fenntartva.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-background/15 hover:text-background/30 text-[11px] tracking-wider font-medium transition-colors duration-400 flex items-center gap-2 cursor-pointer"
          >
            Vissza a tetejére
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
