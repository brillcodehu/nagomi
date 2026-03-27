"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const stats = [
  { number: "500+", label: "Elegedett vendeg" },
  { number: "15+", label: "Heti ora" },
  { number: "6", label: "Fos maximum" },
  { number: "100%", label: "Odafigyles" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const decorY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const circleY = useTransform(scrollYProgress, [0, 1], [30, -80]);
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="rolunk"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/15 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Image side */}
          <div className="relative">
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-chart-3/30 via-card to-accent/20"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full border border-muted-foreground/15 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-muted-foreground/30"
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
                  <p className="text-muted-foreground/30 text-xs tracking-[0.2em] uppercase">
                    Studio foto
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Decorative blob */}
            <motion.div
              style={{ y: decorY }}
              className="absolute -bottom-10 -right-10 w-52 h-52 bg-primary/[0.06] animate-blob-1"
              aria-hidden="true"
            />

            {/* Decorative circle */}
            <motion.div
              style={{ y: circleY }}
              className="absolute -top-8 -left-8 w-36 h-36 border border-primary/10 rounded-full"
              aria-hidden="true"
            />

            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="absolute bottom-10 -right-4 md:right-[-2rem] bg-background/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl shadow-foreground/[0.04]"
            >
              <div className="text-center">
                <span className="font-[family-name:var(--font-cormorant)] text-5xl font-light text-primary">
                  8+
                </span>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40 mt-1">
                  ev tapasztalat
                </p>
              </div>
            </motion.div>
          </div>

          {/* Text side */}
          <div ref={textRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease }}
              className="inline-block text-[11px] tracking-[0.35em] uppercase text-primary/60 mb-6"
            >
              Rolunk
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-7xl font-light leading-[1.05] text-foreground mb-10"
            >
              Ahol a mozgas
              <br />
              <span className="italic text-primary">muveszette</span> valik
            </motion.h2>

            {/* Animated divider line */}
            <motion.div
              style={{ width: lineWidth }}
              className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-10 origin-left"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="space-y-6 text-muted-foreground/60 font-light leading-[1.8] text-[15px]"
            >
              <p>
                A Nagomi studioban hiszunk abban, hogy a pilates tobb, mint
                edzes. Ez egy utazas onmagadhoz, ahol minden mozdulattal kozelebb
                kerulsz a belso egyensulyodhoz.
              </p>
              <p>
                Kepzett oktatoink egyeni figyelmet szentelnek minden vendegnek,
                hogy biztonsagos es hatekony legyen az edzesed. Akar kezdo
                vagy, akar haladoszintu, nalunk megtalald a hozzad illo
                programot.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="mt-14 grid grid-cols-2 gap-8"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease }}
                  className="group"
                >
                  <span className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-foreground group-hover:text-primary transition-colors duration-500">
                    {stat.number}
                  </span>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/35 mt-2">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
