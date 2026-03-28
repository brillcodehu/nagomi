"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { number: "500+", label: "Elégedett vendég" },
  { number: "6", label: "Fős csoportok" },
  { number: "8+", label: "Év tapasztalat" },
  { number: "100%", label: "Odafigyelés" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-15%" });

  // GSAP scroll-driven effects
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Image parallax (deeper movement)
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Heading lines masked reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".about-line-inner");
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

      // Stats stagger reveal with skew
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(
          items,
          { y: 50, opacity: 0, skewY: 3 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Horizontal line draw on scroll
      const hr = sectionRef.current?.querySelector(".about-hr");
      if (hr) {
        gsap.fromTo(
          hr,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: hr,
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
      id="rolunk"
      className="section-scene relative py-28 md:py-40 overflow-hidden"
    >
      {/* Depth 0: Subtle background gradient */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(154,131,99,0.03), transparent)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image side with enhanced parallax */}
          <div className="relative">
            <div
              ref={imageRef}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden image-placeholder"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-foreground/10 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-foreground/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-foreground/20 text-[10px] tracking-[0.2em] uppercase font-medium">
                    Stúdió fotó
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative floating element */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 top-[15%] w-16 h-16 rounded-xl border border-foreground/[0.06] bg-card/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </div>

          {/* Text side */}
          <div ref={textRef}>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
            >
              Rólunk
            </motion.span>

            {/* Masked line reveal heading */}
            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground mb-10"
            >
              <span className="split-line">
                <span className="about-line-inner">
                  Ahol a mozgás
                </span>
              </span>
              <span className="split-line">
                <span className="about-line-inner">
                  <span className="italic">művészetté</span> válik.
                </span>
              </span>
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="space-y-5 text-muted-foreground text-[15px] font-light leading-[1.8] mb-14"
            >
              <p>
                A Nagomi stúdióban hiszünk abban, hogy a pilates több, mint
                edzés. Ez egy utazás önmagadhoz, ahol minden mozdulattal közelebb
                kerülsz a belső egyensúlyodhoz.
              </p>
              <p>
                Képzett oktatóink egyéni figyelmet szentelnek minden vendégnek,
                hogy biztonságos és hatékony legyen az edzésed. Akár kezdő
                vagy, akár haladó szintű, nálunk megtalálod a hozzád illő
                programot.
              </p>
            </motion.div>

            {/* Stats with line draw + stagger */}
            <div
              className="about-hr pt-10 border-t border-foreground/[0.06]"
              style={{ transformOrigin: "left" }}
            />
            <div
              ref={statsRef}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <span className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground">
                    {stat.number}
                  </span>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 font-medium mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
