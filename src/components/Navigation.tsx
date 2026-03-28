"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { label: "Rólunk", href: "#rolunk" },
  { label: "Órák", href: "#orak" },
  { label: "Időpontok", href: "#idopontok" },
  { label: "Vélemények", href: "#velemenyek" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

const ease = [0.22, 1, 0.36, 1] as const;

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
        transition={{ duration: 0.4, ease }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-foreground/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a href="#" className="relative z-10">
              <span className="font-[family-name:var(--font-playfair)] text-[22px] font-bold tracking-[0.08em] text-foreground">
                NAGOMI
              </span>
            </a>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[11px] font-medium tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA button */}
            <a
              href="#foglalj"
              className="hidden lg:inline-flex items-center gap-2 px-7 py-3 text-[11px] tracking-[0.18em] uppercase font-medium bg-primary text-primary-foreground rounded-full hover:bg-foreground transition-colors duration-400"
            >
              Foglalj órát
              <span className="text-[10px]">&#x2197;</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
              aria-label="Menü"
            >
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 8, width: 22 }
                    : { rotate: 0, y: 0, width: 22 }
                }
                transition={{ duration: 0.3, ease }}
                className="block h-[1.5px] bg-foreground origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-[22px] h-[1.5px] bg-foreground"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -8, width: 22 }
                    : { rotate: 0, y: 0, width: 16 }
                }
                transition={{ duration: 0.3, ease }}
                className="block h-[1.5px] bg-foreground origin-center self-end"
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
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease,
                  }}
                  className="text-[13px] tracking-[0.25em] uppercase font-medium text-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#foglalj"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: navLinks.length * 0.05,
                  duration: 0.5,
                  ease,
                }}
                className="mt-4 px-10 py-4 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium rounded-full"
              >
                Foglalj órát
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
