"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

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
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  // Track scroll direction for hide/show
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;
    setScrolled(latest > 30);
    if (latest > previous && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Track active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ═══════ FLOATING NAV BAR ═══════ */}
      <motion.nav
        initial={{ y: -120, opacity: 0 }}
        animate={{
          y: hidden && !mobileOpen ? -120 : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.5, ease }}
        className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
      >
        <div className="max-w-[1440px] mx-auto">
          <div
            className={`
              rounded-[18px] md:rounded-[22px] px-5 md:px-8 lg:px-10
              transition-all duration-700 ease-out
              ${
                scrolled
                  ? "bg-card/92 backdrop-blur-3xl shadow-[0_4px_30px_-6px_rgba(43,42,32,0.12)] border border-foreground/[0.06]"
                  : "bg-card/85 backdrop-blur-2xl shadow-[0_2px_20px_-4px_rgba(43,42,32,0.06)] border border-foreground/[0.04]"
              }
            `}
          >
            <div className="flex items-center justify-between h-[56px] md:h-[64px]">
              {/* ── Logo ── */}
              <a href="#" className="relative z-10 shrink-0">
                <span className="font-[family-name:var(--font-playfair)] text-[19px] md:text-[21px] font-bold tracking-[0.06em] text-foreground select-none">
                  NAGOMI
                </span>
              </a>

              {/* ── Desktop nav links (centered) ── */}
              <div className="hidden lg:flex items-center justify-center gap-7 xl:gap-10">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`
                        relative font-[family-name:var(--font-mono)] text-[10px] xl:text-[10.5px]
                        tracking-[0.16em] uppercase
                        transition-colors duration-300
                        ${isActive ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}
                      `}
                    >
                      {link.label}
                      {/* Active indicator dot */}
                      <span
                        className={`
                          absolute -bottom-2.5 left-1/2 -translate-x-1/2
                          w-[3px] h-[3px] rounded-full bg-primary
                          transition-all duration-300
                          ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                        `}
                      />
                    </a>
                  );
                })}
              </div>

              {/* ── Desktop CTA button ── */}
              <a
                href="#foglalj"
                className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 shrink-0
                  font-[family-name:var(--font-mono)] text-[10px] xl:text-[10.5px] tracking-[0.14em] uppercase
                  bg-primary text-primary-foreground rounded-full
                  hover:bg-foreground
                  transition-colors duration-300"
              >
                <span>Foglalj órát</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="ml-0.5"
                >
                  <path
                    d="M1 9L9 1M9 1H3M9 1V7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* ── Mobile hamburger ── */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
                aria-label="Menü megnyitása"
              >
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 7, width: 20 }
                      : { rotate: 0, y: 0, width: 20 }
                  }
                  transition={{ duration: 0.35, ease }}
                  className="block h-[1.5px] bg-foreground origin-center"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { opacity: 0, scaleX: 0 }
                      : { opacity: 0.4, scaleX: 1 }
                  }
                  transition={{ duration: 0.25 }}
                  className="block w-[20px] h-[1.5px] bg-foreground"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7, width: 20 }
                      : { rotate: 0, y: 0, width: 14 }
                  }
                  transition={{ duration: 0.35, ease }}
                  className="block h-[1.5px] bg-foreground origin-center self-end"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══════ FULLSCREEN MOBILE MENU ═══════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-card"
          >
            {/* Background decorative line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-foreground/[0.03]" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-foreground/[0.03]" />

            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full px-8">
              {/* Nav links */}
              <nav className="flex flex-col items-center gap-6 mb-12">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      delay: 0.08 + i * 0.04,
                      duration: 0.45,
                      ease,
                    }}
                    className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* CTA */}
              <motion.a
                href="#foglalj"
                onClick={closeMobile}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: 0.08 + navLinks.length * 0.04,
                  duration: 0.45,
                  ease,
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5
                  font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase
                  bg-primary text-primary-foreground rounded-full"
              >
                <span>Foglalj órát</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 9L9 1M9 1H3M9 1V7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>

              {/* Bottom info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute bottom-10 left-0 right-0 text-center"
              >
                <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] uppercase text-foreground/15">
                  Debrecen-Józsa &middot; Deák Ferenc utca 2.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
