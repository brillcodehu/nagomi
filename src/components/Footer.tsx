"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-foreground py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-background/5" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/3 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <a href="#" className="inline-block mb-6">
              <span className="font-[family-name:var(--font-cormorant)] text-4xl font-light tracking-wider text-background">
                nagomi
              </span>
            </a>
            <p className="text-background/30 font-light max-w-sm leading-relaxed">
              Premium pilates studio Budapesten. Fedezd fel a belso nyugalmadat
              es talalj ra az egyensulyodra.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-background/30 mb-6">
              Navigacio
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Rolunk", href: "#rolunk" },
                { label: "Oraink", href: "#orak" },
                { label: "Orarend", href: "#idopontok" },
                { label: "Velemenyek", href: "#velemenyek" },
                { label: "Kapcsolat", href: "#kapcsolat" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-background/50 hover:text-chart-3 transition-colors duration-300 text-sm font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-background/30 mb-6">
              Jogi
            </h4>
            <ul className="space-y-3">
              {[
                "Adatvedelmi tajekoztato",
                "Altalanos Szerzodesi Feltetelek",
                "Sutik (Cookie) beallitasok",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-background/50 hover:text-chart-3 transition-colors duration-300 text-sm font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/20 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} Nagomi Pilates Studio. Minden jog fenntartva.
          </p>
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileHover={{ y: -2 }}
            className="text-background/20 hover:text-background/40 text-xs tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            Vissza a tetejere
            <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
