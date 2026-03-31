"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Class data
   ═══════════════════════════════════════ */

const classes = [
  {
    index: "01",
    title: "Reformer Alapok",
    tagline: "A testérzékelés első lépései",
    description:
      "Ismerkedj meg a reformer géppel és a pilates alapelveivel. Oktatónk lépésről lépésre vezet végig az alapgyakorlatokon, figyelembe véve a tested egyedi adottságait.",
    duration: "50 perc",
    level: "Kezdő",
    difficulty: 1,
    benefits: ["Core erősítés", "Testtartás javítás", "Alapelvek"],
    cta: "Kezdj itt",
    variant: "standard" as const,
  },
  {
    index: "02",
    title: "Reformer Flow",
    tagline: "Erő és elegancia egyensúlya",
    description:
      "A stúdió zászlóshajó órája. Folyamatos, áramló mozdulatsorok a reformer gépen, amik egyszerre formálják a tested és nyugtatják az elméd.",
    duration: "55 perc",
    level: "Minden szint",
    difficulty: 2,
    benefits: ["Teljes test edzés", "Rugalmasság", "Stresszoldás"],
    cta: "Próbáld ki",
    variant: "signature" as const,
  },
  {
    index: "03",
    title: "Reformer Sculpt",
    tagline: "Formáld a tested precízióval",
    description:
      "Intenzívebb óra magasabb ellenállással és összetettebb gyakorlatokkal. Célzott izomcsoportokat dolgozunk meg a maximális hatékonyságért.",
    duration: "50 perc",
    level: "Közép / Haladó",
    difficulty: 3,
    benefits: ["Izomformálás", "Intenzív core", "Állóképesség"],
    cta: "Jelentkezz",
    variant: "standard" as const,
  },
  {
    index: "04",
    title: "Privát Óra",
    tagline: "Kizárólag rád szabva",
    description:
      "Személyre szabott edzésterv, egyéni tempó és kizárólagos figyelem. Ideális célzott fejlődéshez, sérülés utáni rehabilitációhoz vagy ha a maximumot akarod kihozni magadból.",
    duration: "55 perc",
    level: "Egyéni",
    difficulty: 0,
    benefits: ["Személyre szabott", "Rugalmas időpont", "Gyorsabb fejlődés"],
    cta: "Egyeztessünk",
    variant: "private" as const,
  },
];

/* ═══════════════════════════════════════
   FAQ data
   ═══════════════════════════════════════ */

const faqs = [
  {
    q: "Kell előzetes pilates tapasztalat?",
    a: "Egyáltalán nem! A Reformer Alapok óránk kifejezetten kezdőknek készült. Oktatónk mindent elmagyaráz és végigkísér az első lépéseken.",
  },
  {
    q: "Mit vigyek magammal?",
    a: "Kényelmes sportruházatot, zoknit (csúszásgátló talpú ideális) és vizet. Törölközőt és szükséges felszerelést biztosítunk.",
  },
  {
    q: "Mennyivel előbb érkezzek?",
    a: "Az első alkalmad előtt kérjük, hogy 10 perccel korábban érkezz, hogy legyen idő a gép beállítására és az ismerkedésre.",
  },
  {
    q: "Mi az a reformer gép?",
    a: "A reformer egy rugós ellenállással működő pilates gép, amin fekvő, ülő és álló pozícióban is edzhetsz. A rugók erőssége állítható, így minden szinthez igazítható.",
  },
  {
    q: "Van egészségügyi korlátozás?",
    a: "Terhesség, friss sérülés vagy műtét után kérjük, egyeztesd oktatónkkal a részvételt. A legtöbb állapothoz tudunk módosított gyakorlatokat ajánlani.",
  },
  {
    q: "Hogyan foglalhatok órát?",
    a: "Online foglalási rendszerünkön keresztül, vagy írj nekünk közvetlenül. Az első alkalomra a Reformer Alapok órát javasoljuk.",
  },
];

/* ═══════════════════════════════════════
   Geometric decorative SVGs
   ═══════════════════════════════════════ */

function ArcDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M 10 190 A 180 180 0 0 1 190 10" stroke="currentColor" strokeWidth="0.6" />
      <path d="M 35 190 A 155 155 0 0 1 190 35" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    </svg>
  );
}

function WaveDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M 0 60 C 66 15 133 105 200 60 C 266 15 333 105 400 60" stroke="currentColor" strokeWidth="0.6" />
      <path d="M 0 78 C 66 33 133 123 200 78 C 266 33 333 123 400 78" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
    </svg>
  );
}

function AngularDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="0" y1="200" x2="200" y2="0" stroke="currentColor" strokeWidth="0.6" />
      <line x1="30" y1="200" x2="200" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      <line x1="60" y1="200" x2="200" y2="60" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
    </svg>
  );
}

function RingDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 10" />
      <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
    </svg>
  );
}

const DECOR_COMPONENTS = [ArcDecor, WaveDecor, AngularDecor, RingDecor];

/* ═══════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════ */

function DifficultyDots({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`difficulty-dot w-[6px] h-[6px] rounded-full border ${
            dot <= level
              ? "bg-primary/70 border-primary/70"
              : "bg-transparent border-background/15"
          }`}
        />
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
    >
      <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   FAQ Modal
   ═══════════════════════════════════════ */

function FAQModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape key + body scroll lock */
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  /* Animate in/out */
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.05 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gyakori kérdések"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/85 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-foreground border border-background/[0.1] rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-background/30 hover:text-background/60 transition-colors z-10"
          aria-label="Bezárás"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-primary/50 mb-3">
            Első alkalom
          </p>
          <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,1.8rem)] font-medium text-background mb-8">
            Gyakori kérdések
          </h3>

          {/* FAQ items */}
          <div className="space-y-0">
            {faqs.map((faq, i) => {
              const isActive = openIndex === i;
              return (
                <div
                  key={i}
                  className="border-t border-background/[0.06] last:border-b"
                >
                  <button
                    onClick={() => setOpenIndex(isActive ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <span className="text-[14px] md:text-[15px] font-light text-background/60 group-hover:text-background/80 transition-colors">
                      {faq.q}
                    </span>
                    <span
                      className="shrink-0 w-5 h-5 flex items-center justify-center text-background/25 transition-transform duration-300"
                      style={{
                        transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-background/25 text-[14px] font-light leading-[1.8] pb-5 pr-10">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA inside modal */}
          <div className="mt-10 text-center">
            <a
              href="#foglalj"
              onClick={onClose}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary/90 text-primary-foreground font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-background hover:text-foreground transition-all duration-400"
            >
              <span>Foglald le az első órádat</span>
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Classes component
   ═══════════════════════════════════════ */

export default function Classes() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentScaleRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const classRowsRef = useRef<HTMLDivElement>(null);
  const firstTimeRef = useRef<HTMLDivElement>(null);

  const [faqOpen, setFaqOpen] = useState(false);
  const closeFaq = useCallback(() => setFaqOpen(false), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* ═══ Reduced motion: show everything immediately ═══ */
      if (reduceMotion) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        gsap.set(introRef.current, { opacity: 1, y: 0 });
        gsap.set(".class-divider", { scaleX: 1 });
        gsap.set(".class-row", { opacity: 1, y: 0 });
        gsap.set(".class-decor", { opacity: 1, rotate: 0 });
        gsap.set(".first-time-block", { opacity: 1, y: 0 });
        return;
      }

      /* ═══ Section scale entry ═══ */
      if (contentScaleRef.current) {
        gsap.fromTo(
          contentScaleRef.current,
          { scale: 0.97 },
          {
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Label fade in ═══ */
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: labelRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Heading masked line reveal ═══ */
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".classes-line-inner");
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Intro paragraph fade ═══ */
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Divider lines draw ═══ */
      const dividers =
        sectionRef.current?.querySelectorAll<HTMLElement>(".class-divider");
      dividers?.forEach((div) => {
        gsap.fromTo(
          div,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: div,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* ═══ Class rows: reveal + ghost parallax + decor + dots ═══ */
      const rows =
        classRowsRef.current?.querySelectorAll<HTMLElement>(".class-row");
      rows?.forEach((row) => {
        gsap.fromTo(
          row,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        const ghostNum = row.querySelector(".class-ghost-num");
        if (ghostNum) {
          gsap.to(ghostNum, {
            yPercent: -25,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }

        const decor = row.querySelector(".class-decor");
        if (decor) {
          gsap.fromTo(
            decor,
            { opacity: 0, rotate: -8, scale: 0.9 },
            {
              opacity: 1,
              rotate: 0,
              scale: 1,
              duration: 1.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        const dots = row.querySelectorAll(".difficulty-dot");
        if (dots.length > 0) {
          gsap.fromTo(
            dots,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.4,
              ease: "back.out(2)",
              stagger: 0.1,
              delay: 0.4,
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        const pills = row.querySelectorAll(".benefit-pill");
        if (pills.length > 0) {
          gsap.fromTo(
            pills,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.08,
              delay: 0.3,
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      /* ═══ "Első alkalom?" fade up ═══ */
      if (firstTimeRef.current) {
        gsap.fromTo(
          firstTimeRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: firstTimeRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="orak"
      className="section-scene relative bg-foreground overflow-hidden"
    >
      {/* ═══ Depth-0: Pilates illustration ghost (screen blend) ═══ */}
      <div className="depth-layer" aria-hidden="true">
        <div
          className="absolute left-[0%] top-[2%] w-[100%] h-[96%] lg:left-[5%] lg:w-[90%]"
          style={{
            backgroundImage: "url(/pilateshero.webp)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 30%",
            filter:
              "invert(1) sepia(1) saturate(0.3) hue-rotate(5deg) brightness(0.8) contrast(1.3)",
            mixBlendMode: "screen",
            opacity: 0.05,
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 40%, black 10%, transparent 65%)",
          }}
        />
      </div>

      {/* ═══ Depth-0: Large background geometric (concentric arcs) ═══ */}
      <div className="depth-layer" aria-hidden="true">
        <svg
          className="absolute right-[-15%] top-[5%] w-[70%] h-[50%] text-background/[0.02]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
          <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
          <circle cx="200" cy="200" r="70" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
        </svg>
        <svg
          className="absolute left-[-10%] bottom-[8%] w-[50%] h-[40%] text-background/[0.015] hidden lg:block"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path d="M 10 390 A 380 380 0 0 1 390 10" stroke="currentColor" strokeWidth="0.4" />
          <path d="M 50 390 A 340 340 0 0 1 390 50" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <path d="M 90 390 A 300 300 0 0 1 390 90" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
        </svg>
      </div>

      {/* ═══ Depth-0: Atmospheric gradients (richer) ═══ */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 55% 45% at 82% 18%, rgba(154,131,99,0.08), transparent 70%)",
            "radial-gradient(ellipse 50% 55% at 12% 65%, rgba(196,185,154,0.06), transparent 70%)",
            "radial-gradient(ellipse 40% 35% at 50% 45%, rgba(154,131,99,0.04), transparent 65%)",
            "radial-gradient(ellipse 30% 40% at 70% 80%, rgba(212,201,181,0.05), transparent 60%)",
            "radial-gradient(ellipse 35% 30% at 25% 25%, rgba(154,131,99,0.04), transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ═══ Depth-0: Accent lines ═══ */}
      <div className="depth-layer" aria-hidden="true">
        <div className="absolute top-[15%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.04] to-transparent" />
        <div className="absolute top-[45%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.03] to-transparent" />
        <div className="absolute top-[75%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.025] to-transparent" />
        <div className="absolute top-0 left-[28%] w-px h-full bg-gradient-to-b from-transparent via-background/[0.03] to-transparent hidden lg:block" />
        <div className="absolute top-0 right-[22%] w-px h-full bg-gradient-to-b from-transparent via-background/[0.025] to-transparent hidden lg:block" />
      </div>

      {/* ═══ Content wrapper with scale entry ═══ */}
      <div
        ref={contentScaleRef}
        className="py-28 md:py-40"
        style={{ transformOrigin: "center center" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          {/* ═══ Header ═══ */}
          <div className="mb-16 md:mb-24">
            <span
              ref={labelRef}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-medium text-secondary/40 mb-8"
              style={{ opacity: 0, transform: "translateY(15px)" }}
            >
              Óráink
            </span>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2
                ref={headingRef}
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-background"
              >
                <span className="split-line">
                  <span className="classes-line-inner">Válaszd ki a</span>
                </span>
                <span className="split-line">
                  <span className="classes-line-inner">
                    <span className="italic">hozzád illőt.</span>
                  </span>
                </span>
              </h2>

              <p
                ref={introRef}
                className="text-background/25 font-light max-w-sm text-[15px] leading-relaxed"
                style={{ opacity: 0, transform: "translateY(15px)" }}
              >
                Minden óratípusunk más megközelítést kínál. Kerülj közelebb a
                célodhoz a számodra tökéletes programmal.
              </p>
            </div>
          </div>

          {/* ═══ Opening divider ═══ */}
          <div
            className="class-divider h-px bg-gradient-to-r from-background/[0.06] via-background/[0.12] to-background/[0.06]"
            style={{ transformOrigin: "left" }}
          />

          {/* ═══ Class rows ═══ */}
          <div ref={classRowsRef}>
            {classes.map((cls, i) => {
              const DecorSvg = DECOR_COMPONENTS[i];
              const isEven = i % 2 === 1;
              const isSignature = cls.variant === "signature";
              const isPrivate = cls.variant === "private";

              return (
                <div key={cls.index}>
                  <div
                    className="class-row relative"
                    style={{ opacity: 0 }}
                  >
                    {/* ═══ SIGNATURE variant: card with accent ═══ */}
                    {isSignature ? (
                      <div className="relative my-4 lg:my-6 bg-background/[0.03] border border-background/[0.06] rounded-2xl py-14 lg:py-20 px-8 lg:px-14 overflow-hidden">
                        {/* Left accent line */}
                        <div
                          className="absolute left-0 top-[12%] bottom-[12%] w-[2px] bg-gradient-to-b from-transparent via-primary/40 to-transparent rounded-full"
                          aria-hidden="true"
                        />

                        {/* Ghost number */}
                        <div
                          className="class-ghost-num absolute top-4 right-4 lg:right-10 pointer-events-none select-none"
                          aria-hidden="true"
                        >
                          <span
                            className="font-[family-name:var(--font-playfair)] text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[14rem] font-bold leading-none"
                            style={{
                              color: "transparent",
                              WebkitTextStroke: "1px rgba(245, 240, 232, 0.05)",
                            }}
                          >
                            {cls.index}
                          </span>
                        </div>

                        {/* Geometric decoration */}
                        <div
                          className="class-decor absolute hidden lg:block pointer-events-none right-[8%] top-1/2 -translate-y-1/2 w-[300px] h-[90px] xl:w-[380px] xl:h-[120px]"
                          aria-hidden="true"
                          style={{ opacity: 0 }}
                        >
                          <DecorSvg className="w-full h-full text-background/[0.06]" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 max-w-2xl lg:ml-[6%]">
                          <div className="flex items-center gap-3 mb-5">
                            <span className="text-[9px] tracking-[0.25em] uppercase font-semibold text-primary border border-primary/30 rounded-full px-4 py-1.5 bg-primary/[0.06]">
                              Signature
                            </span>
                          </div>

                          <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,3.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-background mb-3">
                            {cls.title}
                          </h3>

                          <p className="font-[family-name:var(--font-playfair)] text-[16px] md:text-[17px] italic text-primary/60 mb-7">
                            {cls.tagline}
                          </p>

                          <p className="text-background/35 text-[15px] font-light leading-[1.8] mb-8 max-w-lg">
                            {cls.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 md:gap-5 mb-6">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/25 font-medium">{cls.duration}</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/25 font-medium">{cls.level}</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/25 font-medium">Max 3 fő</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <DifficultyDots level={cls.difficulty} />
                          </div>

                          <div className="flex flex-wrap gap-2 mb-10">
                            {cls.benefits.map((b) => (
                              <span key={b} className="benefit-pill text-[10px] tracking-[0.15em] uppercase text-background/25 font-medium bg-background/[0.05] rounded-full px-4 py-1.5">
                                {b}
                              </span>
                            ))}
                          </div>

                          <a
                            href="#foglalj"
                            className="group inline-flex items-center gap-3 px-7 py-3.5 bg-primary/20 text-primary font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-400"
                          >
                            <span>{cls.cta}</span>
                            <ArrowIcon />
                          </a>
                        </div>
                      </div>
                    ) : isPrivate ? (
                      /* ═══ PRIVATE variant: bordered card, centered ═══ */
                      <div className="relative my-4 lg:my-6 border border-background/[0.08] rounded-2xl py-14 lg:py-16 px-8 lg:px-14 overflow-hidden">
                        {/* Inner glow */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          aria-hidden="true"
                          style={{
                            background:
                              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(154,131,99,0.03), transparent 70%)",
                          }}
                        />

                        {/* Ghost number */}
                        <div
                          className="class-ghost-num absolute top-4 left-4 lg:left-10 pointer-events-none select-none"
                          aria-hidden="true"
                        >
                          <span
                            className="font-[family-name:var(--font-playfair)] text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-bold leading-none"
                            style={{
                              color: "transparent",
                              WebkitTextStroke: "1px rgba(245, 240, 232, 0.04)",
                            }}
                          >
                            {cls.index}
                          </span>
                        </div>

                        {/* Geometric decoration */}
                        <div
                          className="class-decor absolute hidden lg:block pointer-events-none right-[5%] top-1/2 -translate-y-1/2 w-[200px] h-[200px] xl:w-[250px] xl:h-[250px]"
                          aria-hidden="true"
                          style={{ opacity: 0 }}
                        >
                          <DecorSvg className="w-full h-full text-background/[0.04]" />
                        </div>

                        {/* Content — centered on mobile, offset on desktop */}
                        <div className="relative z-10 max-w-2xl lg:ml-[14%]">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[9px] tracking-[0.25em] uppercase font-semibold text-secondary/60 border border-secondary/20 rounded-full px-4 py-1.5">
                              1 : 1 Személyes
                            </span>
                          </div>

                          <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.15] tracking-[-0.01em] text-background mb-2">
                            {cls.title}
                          </h3>

                          <p className="font-[family-name:var(--font-playfair)] text-[15px] md:text-[16px] italic text-primary/50 mb-6">
                            {cls.tagline}
                          </p>

                          <p className="text-background/30 text-[15px] font-light leading-[1.8] mb-8 max-w-lg">
                            {cls.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 md:gap-5 mb-6">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/20 font-medium">{cls.duration}</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/20 font-medium">{cls.level}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {cls.benefits.map((b) => (
                              <span key={b} className="benefit-pill text-[10px] tracking-[0.15em] uppercase text-background/20 font-medium bg-background/[0.04] rounded-full px-4 py-1.5">
                                {b}
                              </span>
                            ))}
                          </div>

                          <a
                            href="#foglalj"
                            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold text-background/50 hover:text-primary transition-colors duration-400"
                          >
                            {cls.cta}
                            <ArrowIcon />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* ═══ STANDARD variant ═══ */
                      <div className="relative py-14 lg:py-20">
                        {/* Ghost number */}
                        <div
                          className={`class-ghost-num absolute top-6 lg:top-2 pointer-events-none select-none ${
                            isEven ? "right-0 lg:right-4" : "left-0 lg:left-4"
                          }`}
                          aria-hidden="true"
                        >
                          <span
                            className="font-[family-name:var(--font-playfair)] text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-bold leading-none"
                            style={{
                              color: "transparent",
                              WebkitTextStroke: "1px rgba(245, 240, 232, 0.04)",
                            }}
                          >
                            {cls.index}
                          </span>
                        </div>

                        {/* Geometric decoration */}
                        <div
                          className={`class-decor absolute hidden lg:block pointer-events-none ${
                            isEven
                              ? "left-[2%] top-1/2 -translate-y-1/2"
                              : "right-[2%] top-1/2 -translate-y-1/2"
                          } w-[180px] h-[180px] xl:w-[220px] xl:h-[220px]`}
                          aria-hidden="true"
                          style={{ opacity: 0 }}
                        >
                          <DecorSvg className="w-full h-full text-background/[0.05]" />
                        </div>

                        {/* Content */}
                        <div
                          className={`relative z-10 max-w-2xl ${
                            isEven ? "lg:ml-auto lg:mr-[14%]" : "lg:ml-[14%]"
                          }`}
                        >
                          <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.15] tracking-[-0.01em] text-background mb-2">
                            {cls.title}
                          </h3>

                          <p className="font-[family-name:var(--font-playfair)] text-[15px] md:text-[16px] italic text-primary/50 mb-6">
                            {cls.tagline}
                          </p>

                          <p className="text-background/30 text-[15px] font-light leading-[1.8] mb-8 max-w-lg">
                            {cls.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 md:gap-5 mb-6">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/20 font-medium">{cls.duration}</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/20 font-medium">{cls.level}</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <span className="text-[10px] tracking-[0.2em] uppercase text-background/20 font-medium">Max 3 fő</span>
                            <span className="w-px h-3 bg-background/10" aria-hidden="true" />
                            <DifficultyDots level={cls.difficulty} />
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {cls.benefits.map((b) => (
                              <span key={b} className="benefit-pill text-[10px] tracking-[0.15em] uppercase text-background/20 font-medium bg-background/[0.04] rounded-full px-4 py-1.5">
                                {b}
                              </span>
                            ))}
                          </div>

                          <a
                            href="#foglalj"
                            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold text-background/50 hover:text-primary transition-colors duration-400"
                          >
                            {cls.cta}
                            <ArrowIcon />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider (not after last or between card variants) */}
                  {i < classes.length - 1 && (
                    <div
                      className="class-divider h-px bg-gradient-to-r from-background/[0.06] via-background/[0.12] to-background/[0.06]"
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ═══ Closing divider ═══ */}
          <div
            className="class-divider h-px bg-gradient-to-r from-background/[0.06] via-background/[0.12] to-background/[0.06] mt-4 lg:mt-6"
            style={{ transformOrigin: "left" }}
          />

          {/* ═══ "Első alkalom?" callout ═══ */}
          <div
            ref={firstTimeRef}
            className="first-time-block mt-20 lg:mt-28"
            style={{ opacity: 0 }}
          >
            <div className="border border-background/[0.08] rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(154,131,99,0.04), transparent 70%)",
                }}
              />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-xl">
                  <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.5rem,2.5vw,2rem)] font-medium text-background mb-4">
                    Első alkalom?
                  </h3>
                  <p className="text-background/30 text-[15px] font-light leading-[1.8]">
                    Ne aggódj, mindenki volt már kezdő! Az első órán oktatónk
                    végigvezet a reformer gép használatán és segít megtalálni a
                    megfelelő beállításokat.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <button
                    onClick={() => setFaqOpen(true)}
                    className="group inline-flex items-center gap-3 px-7 py-3.5 text-background/40 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase border border-background/[0.1] rounded-full hover:border-background/20 hover:text-background/60 transition-all duration-400"
                  >
                    <span>Gyakori kérdések</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover:translate-x-0.5 transition-transform duration-300">
                      <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>

                  <a
                    href="#foglalj"
                    className="group inline-flex items-center gap-3 px-7 py-3.5 bg-primary/90 text-primary-foreground font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-background hover:text-foreground transition-all duration-400 whitespace-nowrap"
                  >
                    <span>Első óra foglalás</span>
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FAQ Modal ═══ */}
      <FAQModal isOpen={faqOpen} onClose={closeFaq} />
    </section>
  );
}
