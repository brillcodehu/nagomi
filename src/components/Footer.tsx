"use client";

import { motion } from "framer-motion";

const footerLinks = [
  { label: "Rolunk", href: "#rolunk" },
  { label: "Oraink", href: "#orak" },
  { label: "Orarend", href: "#idopontok" },
  { label: "Velemenyek", href: "#velemenyek" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

const legalLinks = [
  "Adatvedelmi tajekoztato",
  "Altalanos Szerzodesi Feltetelek",
  "Sutik (Cookie) beallitasok",
];

export default function Footer() {
  return (
    <footer className="relative bg-foreground py-20 md:py-24 overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-background/[0.04]" />

      {/* Background blob */}
      <div
        className="absolute top-[20%] right-[8%] w-[300px] h-[300px] rounded-full bg-primary/[0.02] blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8 mb-20">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="#" className="inline-block mb-6">
              <span className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-[0.15em] uppercase text-background/90">
                Nagomi
              </span>
            </a>
            <p className="text-background/20 font-light max-w-sm leading-relaxed text-[14px]">
              Premium pilates studio Budapesten. Fedezd fel a belso nyugalmadat
              es talalj ra az egyensulyodra.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/20 mb-6">
              Navigacio
            </h4>
            <ul className="space-y-3.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-background/35 hover:text-chart-3 transition-colors duration-500 text-[13px] font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/20 mb-6">
              Jogi
            </h4>
            <ul className="space-y-3.5">
              {legalLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-background/35 hover:text-chart-3 transition-colors duration-500 text-[13px] font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/15 text-[11px] tracking-wider font-light">
            &copy; {new Date().getFullYear()} Nagomi Pilates Studio. Minden jog
            fenntartva.
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -2 }}
            className="text-background/15 hover:text-background/30 text-[11px] tracking-wider font-light transition-colors duration-500 flex items-center gap-2 cursor-pointer"
          >
            Vissza a tetejere
            <svg
              className="w-3 h-3 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
