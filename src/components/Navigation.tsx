"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { label: "Rolunk", href: "#rolunk" },
  { label: "Orak", href: "#orak" },
  { label: "Idopontok", href: "#idopontok" },
  { label: "Velemenyek", href: "#velemenyek" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;
    setScrolled(latest > 50);
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 ${
          scrolled
            ? "bg-background/70 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(186,171,146,0.1)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="relative z-10 group">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl font-light tracking-[0.15em] uppercase text-foreground">
                Nagomi
              </span>
            </a>

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[11px] font-light tracking-[0.25em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-500 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full bg-primary/60 transition-all duration-500 ease-out" />
                </a>
              ))}
            </div>

            <a
              href="#foglalj"
              className="hidden md:inline-flex px-7 py-2.5 text-[11px] tracking-[0.2em] uppercase font-light border border-foreground/15 rounded-full text-foreground hover:bg-foreground hover:text-background transition-all duration-500"
            >
              Foglalj orat
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Menu"
            >
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 7, width: 24 }
                    : { rotate: 0, y: 0, width: 24 }
                }
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block h-px bg-foreground origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-6 h-px bg-foreground"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -7, width: 24 }
                    : { rotate: 0, y: 0, width: 24 }
                }
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block h-px bg-foreground origin-center"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-7">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-[family-name:var(--font-cormorant)] text-5xl font-light text-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#foglalj"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: navLinks.length * 0.06,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6 px-10 py-4 border border-foreground/20 text-sm tracking-[0.2em] uppercase rounded-full text-foreground"
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
