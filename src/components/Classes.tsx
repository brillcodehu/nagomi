"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const classes = [
  {
    title: "Mat Pilates",
    subtitle: "Alapozas & ero",
    description:
      "Klasszikus pilates gyakorlatok matracon, amik erositik a core-od es javitjak a testtartasod.",
    duration: "55 perc",
    level: "Minden szint",
    accent: "bg-warm/10",
  },
  {
    title: "Reformer Pilates",
    subtitle: "Melytizom & formalas",
    description:
      "Reformer gepen vegzett gyakorlatok, amik intenziven formaljak a tested es noveli a rugalmassagod.",
    duration: "50 perc",
    level: "Kozep / Halado",
    accent: "bg-rose/10",
  },
  {
    title: "Pilates Flow",
    subtitle: "Harmonia & legzes",
    description:
      "Lassabb tempoban, a legzesre fokuszalva. Tokeletes stresszoldasra es a test-lelek egyensuly megteremtesere.",
    duration: "60 perc",
    level: "Minden szint",
    accent: "bg-sage/10",
  },
  {
    title: "Power Pilates",
    subtitle: "Intenzitas & kihivas",
    description:
      "Magasabb intenzitasu orak haladoknak, dinamikus mozgasokkal es extra kihhvasokkal.",
    duration: "45 perc",
    level: "Halado",
    accent: "bg-terracotta/10",
  },
];

export default function Classes() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="orak"
      className="relative py-32 md:py-44 bg-brown-deep overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cream/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

      <motion.div
        className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-warm/5 blur-3xl"
      />
      <motion.div
        className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-rose/5 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm tracking-[0.3em] uppercase text-warm-light/50 mb-6"
          >
            Oraink
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] text-cream mb-6"
          >
            Valaszd ki a <span className="italic text-warm-light">tiedet</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream/40 font-light max-w-lg mx-auto"
          >
            Minden oratipusunk mas megkozelitest kinal. Kerulj kozelebb a
            celodhoz a szamodra tokeletes programmal.
          </motion.p>
        </div>

        {/* Class cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * i + 0.3 }}
              className="group relative bg-cream/[0.03] backdrop-blur-sm border border-cream/[0.06] rounded-3xl p-8 md:p-10 hover:bg-cream/[0.06] hover:border-cream/[0.1] transition-all duration-500 cursor-pointer"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-warm/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative">
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-light text-cream group-hover:text-warm-light transition-colors duration-300">
                      {cls.title}
                    </h3>
                    <span className="text-sm tracking-wider text-warm-light/40 mt-1 block">
                      {cls.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-sm text-warm-light">Reszletek</span>
                    <span className="text-warm-light">&rarr;</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-cream/40 font-light leading-relaxed mb-8">
                  {cls.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-warm-light/40" />
                    <span className="text-xs tracking-widest uppercase text-cream/30">
                      {cls.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-warm-light/40" />
                    <span className="text-xs tracking-widest uppercase text-cream/30">
                      {cls.level}
                    </span>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="mt-8 h-[1px] bg-gradient-to-r from-cream/[0.06] to-transparent">
                  <div className="h-full w-0 group-hover:w-full bg-warm-light/20 transition-all duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
