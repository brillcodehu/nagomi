"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const schedule = [
  {
    day: "Hétfő",
    classes: [
      { time: "09:00", name: "Mat Pilates", spots: 3 },
      { time: "17:30", name: "Reformer Pilates", spots: 1 },
      { time: "19:00", name: "Pilates Flow", spots: 4 },
    ],
  },
  {
    day: "Kedd",
    classes: [
      { time: "08:00", name: "Reformer Pilates", spots: 2 },
      { time: "12:00", name: "Mat Pilates", spots: 5 },
      { time: "18:00", name: "Reformer Pilates", spots: 0 },
    ],
  },
  {
    day: "Szerda",
    classes: [
      { time: "09:00", name: "Pilates Flow", spots: 4 },
      { time: "17:30", name: "Mat Pilates", spots: 6 },
      { time: "19:00", name: "Reformer Pilates", spots: 2 },
    ],
  },
  {
    day: "Csütörtök",
    classes: [
      { time: "08:00", name: "Reformer Pilates", spots: 1 },
      { time: "12:00", name: "Pilates Flow", spots: 5 },
      { time: "18:00", name: "Mat Pilates", spots: 3 },
    ],
  },
  {
    day: "Péntek",
    classes: [
      { time: "09:00", name: "Reformer Pilates", spots: 2 },
      { time: "17:00", name: "Pilates Flow", spots: 0 },
      { time: "18:30", name: "Mat Pilates", spots: 6 },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading masked reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(
          ".schedule-line-inner"
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

      // Schedule rows stagger from left with line wipe
      if (rowsRef.current) {
        const rows = rowsRef.current.querySelectorAll(".schedule-row");
        gsap.fromTo(
          rows,
          {
            opacity: 0,
            x: -40,
            clipPath: "inset(0 100% 0 0)",
          },
          {
            opacity: 1,
            x: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: rowsRef.current,
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
      id="idopontok"
      className="section-scene relative py-28 md:py-40 overflow-hidden"
    >
      {/* Depth 0: Subtle gradient */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 60%, rgba(154,131,99,0.025), transparent)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
            >
              Órarend
            </motion.span>

            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground"
            >
              <span className="split-line">
                <span className="schedule-line-inner">
                  Heti <span className="italic">időpontok.</span>
                </span>
              </span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-2"
          >
            <div className="text-[12px] text-muted-foreground/50 font-light">
              H-P: 07:00 - 21:00 &middot; Szo: 08:00 - 14:00
            </div>
            <a
              href="#foglalj"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-medium text-foreground/50 hover:text-foreground transition-colors duration-400"
            >
              Online foglalás
              <span className="text-[10px]">&#x2197;</span>
            </a>
          </motion.div>
        </div>

        {/* Schedule rows with line wipe reveal */}
        <div ref={rowsRef}>
          {schedule.map((day) => (
            <div
              key={day.day}
              className="schedule-row grid grid-cols-12 gap-4 items-start py-6 border-t border-foreground/[0.06] last:border-b"
            >
              <div className="col-span-12 md:col-span-2">
                <span className="text-[13px] tracking-[0.15em] uppercase font-medium text-foreground/70">
                  {day.day}
                </span>
              </div>

              <div className="col-span-12 md:col-span-10 grid sm:grid-cols-3 gap-3">
                {day.classes.map((cls) => {
                  const isFull = cls.spots === 0;
                  return (
                    <div
                      key={`${day.day}-${cls.time}`}
                      className={`rounded-xl p-4 transition-all duration-400 ${
                        isFull
                          ? "bg-muted/40 opacity-40"
                          : "bg-muted/50 hover:bg-muted/80 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-medium">
                          {cls.time}
                        </span>
                        {isFull ? (
                          <span className="text-[9px] tracking-[0.1em] uppercase text-destructive/50 font-medium">
                            Betelt
                          </span>
                        ) : (
                          <span className="text-[9px] tracking-[0.1em] uppercase text-primary/60 font-medium">
                            {cls.spots} hely
                          </span>
                        )}
                      </div>
                      <span className="text-[14px] font-medium text-foreground/80">
                        {cls.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          id="foglalj"
          className="mt-16 text-center"
        >
          <a
            href="#foglalj"
            className="inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:bg-primary transition-colors duration-400"
          >
            Foglalj időpontot
            <span className="text-[10px]">&#x2197;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
