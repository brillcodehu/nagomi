"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const classes = [
  {
    title: "Mat Pilates",
    description:
      "Klasszikus pilates gyakorlatok matrácon, amik erősítik a core-od és javítják a testtartásod. Ideális kiindulópont.",
    duration: "55 perc",
    level: "Minden szint",
    cta: "Kezdj itt",
  },
  {
    title: "Reformer Pilates",
    description:
      "Gépen végzett intenzív gyakorlatok, melyek formálják tested és növelik rugalmasságod. A stúdió zászlóshajó órája.",
    duration: "50 perc",
    level: "Közép / Haladó",
    cta: "Próbáld ki",
  },
  {
    title: "Pilates Flow",
    description:
      "Lassabb tempóban, a légzésre fókuszálva. Tökéletes stresszoldásra és a test-lélek egyensúly megteremtésére.",
    duration: "60 perc",
    level: "Minden szint",
    cta: "Fedezd fel",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const GHOST_TEXT = "PILATES";

export default function Classes() {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Ghost text parallax
      if (ghostRef.current) {
        gsap.to(ghostRef.current, {
          xPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      // Heading masked reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(
          ".classes-line-inner"
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

      // Cards with skew + elastic entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".class-card");
        gsap.fromTo(
          cards,
          {
            y: 80,
            opacity: 0,
            skewY: 4,
          },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1,
            ease: "back.out(1.4)",
            stagger: 0.12,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
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
      className="section-scene relative py-28 md:py-40 bg-foreground overflow-hidden"
    >
      {/* Depth 0: Ghost outlined text */}
      <div
        ref={ghostRef}
        className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="ghost-text font-[family-name:var(--font-playfair)]"
          style={{
            fontSize: "clamp(8rem, 22vw, 22rem)",
            marginLeft: "-8%",
          }}
        >
          {GHOST_TEXT}
        </span>
      </div>

      {/* Depth 1: Atmospheric glow */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(154,131,99,0.06), transparent)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] tracking-[0.3em] uppercase font-medium text-secondary/40 mb-8"
          >
            Óráink
          </motion.span>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-background"
            >
              <span className="split-line">
                <span className="classes-line-inner">
                  Válaszd ki a
                </span>
              </span>
              <span className="split-line">
                <span className="classes-line-inner">
                  <span className="italic">hozzád illőt.</span>
                </span>
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-background/25 font-light max-w-sm text-[15px] leading-relaxed"
            >
              Minden óratípusunk más megközelítést kínál. Kerülj közelebb a
              célodhoz a számodra tökéletes programmal.
            </motion.p>
          </div>
        </div>

        {/* Cards with skew + elastic entrance */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-5">
          {classes.map((cls) => (
            <div
              key={cls.title}
              className="class-card group bg-card rounded-2xl p-8 md:p-10 flex flex-col justify-between min-h-[380px] hover:shadow-2xl hover:shadow-foreground/10 transition-shadow duration-500"
            >
              <div>
                <h3 className="text-[13px] tracking-[0.2em] uppercase font-semibold text-foreground mb-6">
                  {cls.title}
                </h3>

                <p className="text-foreground/50 text-[15px] font-light leading-[1.7] mb-8">
                  {cls.description}
                </p>

                <div className="flex items-center gap-5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-medium">
                  <span>{cls.duration}</span>
                  <span className="w-px h-3 bg-foreground/10" />
                  <span>{cls.level}</span>
                </div>
              </div>

              <a
                href="#foglalj"
                className="mt-10 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold text-foreground group-hover:text-primary transition-colors duration-400"
              >
                {cls.cta}
                <span className="text-[10px] group-hover:translate-x-0.5 transition-transform duration-300">
                  &#x2197;
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
