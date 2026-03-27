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
  },
  {
    title: "Reformer Pilates",
    subtitle: "Melytizom & formalas",
    description:
      "Reformer gepen vegzett gyakorlatok, amik intenziven formaljak a tested es novelik a rugalmassagod.",
    duration: "50 perc",
    level: "Kozep / Halado",
  },
  {
    title: "Pilates Flow",
    subtitle: "Harmonia & legzes",
    description:
      "Lassabb tempoban, a legzesre fokuszalva. Tokeletes stresszoldasra es a test-lelek egyensuly megteremtesere.",
    duration: "60 perc",
    level: "Minden szint",
  },
  {
    title: "Power Pilates",
    subtitle: "Intenzitas & kihivas",
    description:
      "Magasabb intenzitasu orak haladoknak, dinamikus mozgasokkal es extra kihivasokkal.",
    duration: "45 perc",
    level: "Halado",
  },
];

export default function Classes() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="orak"
      className="relative py-32 md:py-44 bg-foreground overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-background/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-background/10 to-transparent" />

      <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm tracking-[0.3em] uppercase text-chart-3/50 mb-6"
          >
            Oraink
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] text-background mb-6"
          >
            Valaszd ki a <span className="italic text-chart-3">tiedet</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-background/40 font-light max-w-lg mx-auto"
          >
            Minden oratipusunk mas megkozelitest kinal. Kerulj kozelebb a
            celodhoz a szamodra tokeletes programmal.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * i + 0.3 }}
              className="group relative bg-background/[0.03] backdrop-blur-sm border border-background/[0.06] rounded-3xl p-8 md:p-10 hover:bg-background/[0.06] hover:border-background/[0.1] transition-all duration-500 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-light text-background group-hover:text-chart-3 transition-colors duration-300">
                      {cls.title}
                    </h3>
                    <span className="text-sm tracking-wider text-chart-3/40 mt-1 block">
                      {cls.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-sm text-chart-3">Reszletek</span>
                    <span className="text-chart-3">&rarr;</span>
                  </div>
                </div>

                <p className="text-background/40 font-light leading-relaxed mb-8">
                  {cls.description}
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-chart-3/40" />
                    <span className="text-xs tracking-widest uppercase text-background/30">
                      {cls.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-chart-3/40" />
                    <span className="text-xs tracking-widest uppercase text-background/30">
                      {cls.level}
                    </span>
                  </div>
                </div>

                <div className="mt-8 h-[1px] bg-gradient-to-r from-background/[0.06] to-transparent">
                  <div className="h-full w-0 group-hover:w-full bg-chart-3/20 transition-all duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
