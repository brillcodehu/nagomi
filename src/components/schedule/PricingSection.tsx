"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Pricing data (matching seed)
   ═══════════════════════════════════════ */

const classPrices = [
  { name: "Reformer Alapok", price: 4500, difficulty: 1 },
  { name: "Reformer Flow", price: 5000, difficulty: 2 },
  { name: "Reformer Sculpt", price: 5000, difficulty: 3 },
  { name: "Privát Óra", price: 12000, difficulty: 0, isPrivate: true },
];

const passes = [
  {
    name: "5 alkalmas bérlet",
    occasions: 5,
    price: 20000,
    validDays: 30,
    description: "Ideális heti 1-2 alkalom mellé, egy hónapos érvényességgel.",
    isBest: false,
  },
  {
    name: "10 alkalmas bérlet",
    occasions: 10,
    price: 36000,
    validDays: 60,
    description: "A legnépszerubb választás rendszeres edzoknek. Legjobb ár-érték arány.",
    isBest: true,
  },
  {
    name: "Havi korlátlan",
    occasions: null,
    price: 52000,
    validDays: 30,
    description: "Korlátlan részvétel minden csoportos órán egy teljes hónapig.",
    isBest: false,
  },
];

/* ═══════════════════════════════════════
   Difficulty Dots
   ═══════════════════════════════════════ */

function DifficultyDots({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`w-[5px] h-[5px] rounded-full ${
            dot <= level ? "bg-primary/60" : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Arrow Icon
   ═══════════════════════════════════════ */

function ArrowIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
    >
      <path
        d="M1 9L9 1M9 1H3M9 1V7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   PricingSection
   ═══════════════════════════════════════ */

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const classCardsRef = useRef<HTMLDivElement>(null);
  const passCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Label fade in
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

      // Heading masked reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(
          ".pricing-line-inner"
        );
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

      // Class price cards stagger
      if (classCardsRef.current) {
        const cards = classCardsRef.current.querySelectorAll(".price-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: classCardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Pass cards stagger
      if (passCardsRef.current) {
        const cards = passCardsRef.current.querySelectorAll(".pass-card");
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 40,
            clipPath: "inset(0 0 10% 0)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: passCardsRef.current,
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
      id="arak"
      className="section-scene relative py-28 md:py-40 overflow-hidden"
    >
      {/* Depth 0: Subtle gradient */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 25% 40%, rgba(154,131,99,0.025), transparent)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* ═══ Header ═══ */}
        <div className="mb-16 md:mb-24">
          <span
            ref={labelRef}
            className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
            style={{ opacity: 0, transform: "translateY(15px)" }}
          >
            Árak
          </span>

          <h2
            ref={headingRef}
            className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground"
          >
            <span className="split-line">
              <span className="pricing-line-inner">
                <span className="italic">Áraink.</span>
              </span>
            </span>
          </h2>
        </div>

        {/* ═══ Single class prices ═══ */}
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-medium mb-6">
            Egyedi óra árak
          </p>

          <div
            ref={classCardsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {classPrices.map((cls) => (
              <div
                key={cls.name}
                className="price-card bg-muted/40 rounded-xl p-5 transition-all duration-300 hover:bg-muted/60"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[13px] font-medium text-foreground/70">
                    {cls.name}
                  </span>
                  {cls.difficulty > 0 && (
                    <DifficultyDots level={cls.difficulty} />
                  )}
                </div>
                <span className="font-[family-name:var(--font-playfair)] text-[24px] font-medium text-foreground/90">
                  {cls.price.toLocaleString("hu-HU")}
                </span>
                <span className="text-[12px] text-muted-foreground/50 ml-1">
                  Ft
                </span>
                {cls.isPrivate && (
                  <div className="mt-2">
                    <span className="text-[8px] tracking-[0.15em] uppercase text-primary/50 font-semibold">
                      1:1 Személyes
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Divider ═══ */}
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent mb-16 md:mb-24" />

        {/* ═══ Pass prices ═══ */}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-medium mb-6">
            Bérletek
          </p>

          <div
            ref={passCardsRef}
            className="grid md:grid-cols-3 gap-4"
          >
            {passes.map((pass) => {
              const perOccasion = pass.occasions
                ? Math.round(pass.price / pass.occasions)
                : null;

              return (
                <div
                  key={pass.name}
                  className={`pass-card relative rounded-2xl p-7 md:p-8 transition-all duration-300 ${
                    pass.isBest
                      ? "bg-muted/60 border border-primary/15"
                      : "bg-muted/40 border border-transparent hover:border-foreground/[0.04]"
                  }`}
                >
                  {/* Best value badge */}
                  {pass.isBest && (
                    <div className="absolute top-5 right-5">
                      <span className="text-[8px] tracking-[0.2em] uppercase font-semibold text-primary border border-primary/25 rounded-full px-3 py-1 bg-primary/[0.06]">
                        Legjobb érték
                      </span>
                    </div>
                  )}

                  <h3 className="font-[family-name:var(--font-playfair)] text-[20px] md:text-[22px] font-medium text-foreground/90 mb-4">
                    {pass.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="font-[family-name:var(--font-playfair)] text-[36px] md:text-[42px] font-medium text-primary">
                      {pass.price.toLocaleString("hu-HU")}
                    </span>
                    <span className="text-[14px] text-muted-foreground/50 ml-1.5">
                      Ft
                    </span>
                  </div>

                  {/* Per occasion */}
                  {perOccasion && (
                    <p className="text-[12px] text-primary/60 font-medium mb-4">
                      {perOccasion.toLocaleString("hu-HU")} Ft / alkalom
                    </p>
                  )}
                  {!perOccasion && (
                    <p className="text-[12px] text-primary/60 font-medium mb-4">
                      Korlátlan alkalom
                    </p>
                  )}

                  {/* Valid days */}
                  <p className="text-[11px] text-muted-foreground/40 mb-4">
                    Érvényesség: {pass.validDays} nap
                  </p>

                  {/* Description */}
                  <p className="text-[14px] text-foreground/40 font-light leading-[1.7] mb-6">
                    {pass.description}
                  </p>

                  {/* CTA */}
                  <a
                    href="#foglalj"
                    className={`group inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-semibold transition-colors duration-300 cursor-pointer ${
                      pass.isBest
                        ? "text-primary hover:text-foreground"
                        : "text-foreground/40 hover:text-primary"
                    }`}
                  >
                    Bérlet vásárlás
                    <ArrowIcon />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
