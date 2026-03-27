"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Rolunk", href: "#rolunk" },
  { label: "Orak", href: "#orak" },
  { label: "Idopontok", href: "#idopontok" },
  { label: "Velemenyek", href: "#velemenyek" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(139,111,71,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="relative z-10 group">
              <span className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-wider text-brown-deep group-hover:text-brown transition-colors duration-300">
                nagomi
              </span>
              <span className="block h-[1px] w-0 group-hover:w-full bg-warm transition-all duration-500" />
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-light tracking-widest uppercase text-brown-dark/70 hover:text-brown-deep transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 group-hover:w-full bg-warm transition-all duration-400 ease-out" />
                </a>
              ))}
            </div>

            {/* CTA button */}
            <a
              href="#foglalj"
              className="hidden md:inline-flex items-center gap-2 px-7 py-3 bg-brown-deep text-cream text-sm font-light tracking-widest uppercase rounded-full hover:bg-brown-dark transition-all duration-300 hover:shadow-lg hover:shadow-brown-deep/10"
            >
              Foglalj orat
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-[1.5px] bg-brown-deep origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-[1.5px] bg-brown-deep"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-[1.5px] bg-brown-deep origin-center"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-brown-deep hover:text-warm transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#foglalj"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.5 }}
                className="mt-4 px-10 py-4 bg-brown-deep text-cream text-sm tracking-widest uppercase rounded-full"
              >
                Foglalj orat
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
