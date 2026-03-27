"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const classes = [
  {
    index: "01",
    title: "Mat Pilates",
    subtitle: "Alapozas & ero",
    description:
      "Klasszikus pilates gyakorlatok matracon, amik erositik a core-od es javitjak a testtartasod.",
    duration: "55 perc",
    level: "Minden szint",
  },
  {
    index: "02",
    title: "Reformer Pilates",
    subtitle: "Melytizom & formalas",
    description:
      "Reformer gepen vegzett gyakorlatok, amik intenziven formaljak a tested es novelik a rugalmassagod.",
    duration: "50 perc",
    level: "Kozep / Halado",
  },
  {
    index: "03",
    title: "Pilates Flow",
    subtitle: "Harmonia & legzes",
    description:
      "Lassabb tempoban, a legzesre fokuszalva. Tokeletes stresszoldasra es a test-lelek egyensuly megteremtesere.",
    duration: "60 perc",
    level: "Minden szint",
  },
  {
    index: "04",
    title: "Power Pilates",
    subtitle: "Intenzitas & kihivas",
    description:
      "Magasabb intenzitasu orak haladoknak, dinamikus mozgasokkal es extra kihivasokkal.",
    duration: "45 perc",
    level: "Halado",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function ClassCard({
  cls,
  index,
  isInView,
}: {
  cls: (typeof classes)[0];
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(10px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12 + 0.2, ease }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-background/[0.03] backdrop-blur-sm border border-background/[0.06] rounded-3xl p-8 md:p-10 transition-[transform,background,border] duration-500 ease-out cursor-pointer hover:bg-background/[0.07] hover:border-background/[0.12]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,158,136,0.06), transparent 40%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Index number */}
          <span className="font-[family-name:var(--font-cormorant)] text-7xl md:text-8xl font-light text-background/[0.04] absolute -top-2 -left-1 select-none pointer-events-none">
            {cls.index}
          </span>

          <div className="flex items-start justify-between mb-6 pt-4">
            <div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-light text-background group-hover:text-chart-3 transition-colors duration-500">
                {cls.title}
              </h3>
              <span className="text-[11px] tracking-[0.2em] uppercase text-chart-3/30 mt-1.5 block">
                {cls.subtitle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-8px] group-hover:translate-x-0">
              <span className="text-[11px] tracking-wider text-chart-3/70">
                Reszletek
              </span>
              <span className="text-chart-3/70">&rarr;</span>
            </div>
          </div>

          <p className="text-background/30 font-light leading-relaxed mb-8 text-[15px]">
            {cls.description}
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-1 rounded-full bg-chart-3/30" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-background/25">
                {cls.duration}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-1 rounded-full bg-chart-3/30" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-background/25">
                {cls.level}
              </span>
            </div>
          </div>

          {/* Bottom line reveal */}
          <div className="mt-8 h-px bg-background/[0.04]">
            <div className="h-full w-0 group-hover:w-full bg-chart-3/15 transition-all duration-700 ease-out" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Classes() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="orak"
      className="relative py-32 md:py-48 bg-foreground overflow-hidden"
    >
      {/* Subtle top/bottom lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-background/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-background/5 to-transparent" />

      {/* Background blobs */}
      <div
        className="absolute top-[15%] right-[3%] w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[10%] left-[8%] w-[350px] h-[350px] rounded-full bg-accent/[0.03] blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block text-[11px] tracking-[0.35em] uppercase text-chart-3/35 mb-6"
          >
            Oraink
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl lg:text-8xl font-light leading-[1] text-background mb-7"
          >
            Valaszd ki a <span className="italic text-chart-3">tiedet</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-background/25 font-light max-w-lg mx-auto text-[15px]"
          >
            Minden oratipusunk mas megkozelitest kinal. Kerulj kozelebb a
            celodhoz a szamodra tokeletes programmal.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {classes.map((cls, i) => (
            <ClassCard key={cls.title} cls={cls} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
