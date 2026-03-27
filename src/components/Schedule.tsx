"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const schedule = [
  {
    day: "Hetfo",
    classes: [
      { time: "09:00", name: "Mat Pilates", spots: 3 },
      { time: "17:30", name: "Reformer Pilates", spots: 1 },
      { time: "19:00", name: "Pilates Flow", spots: 4 },
    ],
  },
  {
    day: "Kedd",
    classes: [
      { time: "08:00", name: "Power Pilates", spots: 2 },
      { time: "12:00", name: "Mat Pilates", spots: 5 },
      { time: "18:00", name: "Reformer Pilates", spots: 0 },
    ],
  },
  {
    day: "Szerda",
    classes: [
      { time: "09:00", name: "Pilates Flow", spots: 4 },
      { time: "17:30", name: "Mat Pilates", spots: 6 },
      { time: "19:00", name: "Power Pilates", spots: 2 },
    ],
  },
  {
    day: "Csutortok",
    classes: [
      { time: "08:00", name: "Reformer Pilates", spots: 1 },
      { time: "12:00", name: "Pilates Flow", spots: 5 },
      { time: "18:00", name: "Mat Pilates", spots: 3 },
    ],
  },
  {
    day: "Pentek",
    classes: [
      { time: "09:00", name: "Power Pilates", spots: 2 },
      { time: "17:00", name: "Reformer Pilates", spots: 0 },
      { time: "18:30", name: "Pilates Flow", spots: 6 },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="idopontok"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background blobs */}
      <div
        className="absolute top-[15%] left-[3%] w-[500px] h-[500px] rounded-full bg-secondary/[0.06] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[10%] right-[8%] w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="inline-block text-[11px] tracking-[0.35em] uppercase text-primary/50 mb-6"
            >
              Orarend
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl lg:text-8xl font-light leading-[1] text-foreground"
            >
              Heti <span className="italic text-primary">idopontok</span>
            </motion.h2>
          </div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            href="#foglalj"
            className="mt-8 md:mt-0 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-500 group"
          >
            Osszes idopont
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
          </motion.a>
        </div>

        {/* Schedule rows */}
        <div className="space-y-0">
          {schedule.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: dayIndex * 0.07 + 0.2,
                ease,
              }}
            >
              <div className="grid grid-cols-12 gap-4 items-start py-7 border-t border-foreground/[0.06] hover:border-foreground/[0.12] transition-colors duration-500 group">
                <div className="col-span-12 md:col-span-2">
                  <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light text-foreground/80 group-hover:text-foreground transition-colors duration-500">
                    {day.day}
                  </span>
                </div>

                <div className="col-span-12 md:col-span-10 grid sm:grid-cols-3 gap-3">
                  {day.classes.map((cls) => {
                    const isFull = cls.spots === 0;
                    return (
                      <div
                        key={`${day.day}-${cls.time}`}
                        className={`relative rounded-2xl p-5 transition-all duration-500 cursor-pointer ${
                          isFull
                            ? "bg-muted/20 opacity-50"
                            : "bg-muted/30 hover:bg-muted/50 hover:shadow-lg hover:shadow-foreground/[0.03] hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 font-light">
                            {cls.time}
                          </span>
                          {isFull ? (
                            <span className="text-[9px] tracking-[0.15em] uppercase text-destructive/60 bg-destructive/[0.06] px-2.5 py-1 rounded-full">
                              Betelt
                            </span>
                          ) : (
                            <span className="text-[9px] tracking-[0.15em] uppercase text-chart-5/70 bg-chart-5/[0.08] px-2.5 py-1 rounded-full">
                              {cls.spots} hely
                            </span>
                          )}
                        </div>
                        <h4 className="font-[family-name:var(--font-cormorant)] text-xl font-medium text-foreground/90">
                          {cls.name}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          id="foglalj"
          className="mt-20 text-center"
        >
          <a
            href="#foglalj"
            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background text-[11px] tracking-[0.2em] uppercase font-light rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/15"
          >
            <span className="relative z-10">Online foglalas</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out" />
          </a>
          <p className="mt-5 text-[13px] text-muted-foreground/35 font-light">
            Valaszd ki a szamodra megfelelo idopontot es fizess online
          </p>
        </motion.div>
      </div>
    </section>
  );
}
