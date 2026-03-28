"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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
  const isInView = useInView(textRef, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={sectionRef}
      id="rolunk"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image side */}
          <motion.div
            style={{ y: imageY }}
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
          </motion.div>

          {/* Text side */}
          <div ref={textRef}>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-8"
            >
              Rólunk
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground mb-10"
            >
              Ahol a mozgás
              <br />
              <span className="italic">művészetté</span> válik.
            </motion.h2>

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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-foreground/[0.06]"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground">
                    {stat.number}
                  </span>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 font-medium mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
