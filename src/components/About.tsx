"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const decorY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="rolunk"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sand/40" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Image side */}
          <div className="relative">
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              {/* Placeholder image - warm toned */}
              <div className="absolute inset-0 bg-gradient-to-br from-warm-light/40 via-sand to-rose/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border border-brown/20 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-brown/40"
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
                  <p className="text-brown/40 text-sm tracking-wider">Studio foto</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative floating element */}
            <motion.div
              style={{ y: decorY }}
              className="absolute -bottom-8 -right-8 w-48 h-48 bg-warm/10 blob-shape"
            />
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], [20, -60]) }}
              className="absolute -top-6 -left-6 w-32 h-32 border border-warm/20 rounded-full"
            />

            {/* Stats overlay */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-8 -right-4 md:right-[-2rem] bg-cream/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-brown-deep/5"
            >
              <div className="text-center">
                <span className="font-[family-name:var(--font-cormorant)] text-5xl font-light text-warm-dark">
                  8+
                </span>
                <p className="text-xs tracking-widest uppercase text-brown/50 mt-1">
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
              transition={{ duration: 0.6 }}
              className="inline-block text-sm tracking-[0.3em] uppercase text-warm-dark/70 mb-6"
            >
              Rolunk
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-brown-deep mb-8"
            >
              Ahol a mozgas
              <br />
              <span className="italic text-warm-dark">muveszette</span> valik
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 text-brown/60 font-light leading-relaxed"
            >
              <p>
                A Nagomi studioban hiszunk abban, hogy a pilates tobb, mint
                edzes. Ez egy utazas onmagadhoz, ahol minden mozdulattal kozelebb
                kerulsz a belso egyensulyodhoz.
              </p>
              <p>
                Kepzett oktatoink egyeni figyelmet szentelnek minden vendegnek,
                hogy biztonsagos es hatekonny legyen az edzesed. Akar kezdo
                vagy, akar haladoszintu, nalunk megtalald a hozzad illo
                programot.
              </p>
            </motion.div>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 grid grid-cols-2 gap-6"
            >
              {[
                { number: "500+", label: "Elegedett vendeg" },
                { number: "15+", label: "Heti ora" },
                { number: "6", label: "Fos maximum" },
                { number: "100%", label: "Odafigyles" },
              ].map((stat, i) => (
                <div key={i} className="group">
                  <span className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-brown-deep group-hover:text-warm-dark transition-colors duration-300">
                    {stat.number}
                  </span>
                  <p className="text-xs tracking-widest uppercase text-brown/40 mt-1">
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
