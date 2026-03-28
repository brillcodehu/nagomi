"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */

const navLinks = [
  { label: "Rólunk", href: "#rolunk" },
  { label: "Óráink", href: "#orak" },
  { label: "Órarend", href: "#idopontok" },
  { label: "Vélemények", href: "#velemenyek" },
];

const legalLinks = [
  { label: "Adatvédelmi tájékoztató", href: "#" },
  { label: "ÁSZF", href: "#" },
  { label: "Cookie beállítások", href: "#" },
];

const contactInfo = [
  {
    label: "Stúdió",
    value: "Debrecen-Józsa\nDeák Ferenc utca 2.",
  },
  {
    label: "Email",
    value: "hello@nagomi.hu",
    href: "mailto:hello@nagomi.hu",
  },
  {
    label: "Telefon",
    value: "+36 30 123 4567",
    href: "tel:+36301234567",
  },
  {
    label: "Nyitvatartás",
    value: "H–P: 07:00–21:00\nSzo: 08:00–14:00",
  },
];

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(dividerRef.current, { scaleX: 1 });
        return;
      }

      /* Contact info stagger */
      if (contentRef.current) {
        const items =
          contentRef.current.querySelectorAll(".footer-contact-item");
        gsap.fromTo(
          items,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Divider draw */
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-foreground overflow-hidden"
    >
      {/* ═══ Depth 0: Map atmospheric haze ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/footerimage.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(40px) brightness(1.3) saturate(0.2)",
            mixBlendMode: "screen",
            opacity: 0.04,
            maskImage:
              "radial-gradient(ellipse 90% 80% at 50% 50%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 50% 50%, black, transparent 75%)",
          }}
        />
      </div>

      {/* ═══ Depth 1: Map line-art ghost ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/footerimage.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter:
              "invert(1) sepia(1) saturate(0.3) hue-rotate(5deg) brightness(0.8) contrast(1.4)",
            mixBlendMode: "screen",
            opacity: 0.06,
            maskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 50% 50%, black 10%, transparent 70%)",
          }}
        />
      </div>

      {/* ═══ Depth 0: Atmospheric gradients ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 50% 40% at 30% 30%, rgba(154,131,99,0.06), transparent 70%)",
            "radial-gradient(ellipse 45% 35% at 75% 70%, rgba(196,185,154,0.04), transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ═══ Depth 0: Fine accent lines ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[35%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.03] to-transparent" />
        <div className="absolute top-0 left-[65%] w-px h-full bg-gradient-to-b from-transparent via-background/[0.025] to-transparent hidden lg:block" />
      </div>

      {/* ═══ Content ═══ */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 pt-20 md:pt-28 pb-10"
      >
        {/* ═══ Top: Brand + Contact info ═══ */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-20">
          {/* Brand */}
          <div className="md:col-span-4 footer-contact-item">
            <a href="#" className="inline-block mb-6">
              <span className="font-[family-name:var(--font-playfair)] text-[24px] font-bold tracking-[0.08em] text-background/90">
                NAGOMI
              </span>
            </a>
            <p className="text-background/20 font-light max-w-xs leading-[1.8] text-[14px] mb-8">
              Premium reformer pilates stúdió Debrecenben.
              Ahol a tested és lelked újra harmóniába kerül.
            </p>

            {/* Social */}
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-background/20 hover:text-primary transition-colors duration-400"
                aria-label="Instagram"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-background/20 hover:text-primary transition-colors duration-400"
                aria-label="Facebook"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact info grid */}
          <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="footer-contact-item">
                <span className="text-[10px] tracking-[0.25em] uppercase text-background/15 font-medium block mb-4">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-[13px] text-background/35 hover:text-secondary font-light leading-[1.8] whitespace-pre-line transition-colors duration-400"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-[13px] text-background/35 font-light leading-[1.8] whitespace-pre-line">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Middle divider ═══ */}
        <div
          ref={dividerRef}
          className="h-px bg-gradient-to-r from-transparent via-background/[0.06] to-transparent mb-10 origin-left"
          style={{ transform: "scaleX(0)" }}
        />

        {/* ═══ Bottom: Nav + Legal + Copyright ═══ */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-6 items-end">
          {/* Navigation */}
          <div className="md:col-span-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-background/20 hover:text-secondary transition-colors duration-400 text-[12px] font-light tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="md:col-span-4">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-background/12 hover:text-background/25 transition-colors duration-400 text-[11px] font-light tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright + back to top */}
          <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-6">
            <p className="text-background/10 text-[11px] tracking-wider font-light">
              &copy; {new Date().getFullYear()} Nagomi Pilates
            </p>
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="group flex items-center gap-2 text-background/12 hover:text-background/30 transition-colors duration-400 cursor-pointer"
              aria-label="Vissza a tetejére"
            >
              <span className="text-[10px] tracking-[0.15em] uppercase font-medium hidden sm:inline">
                Tetejére
              </span>
              <div className="w-8 h-8 rounded-full border border-background/[0.06] group-hover:border-background/[0.12] flex items-center justify-center transition-colors duration-400">
                <svg
                  className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
