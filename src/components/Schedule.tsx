"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const schedule = [
  { day: "Hetfo", classes: [{ time: "09:00", name: "Mat Pilates", spots: 3 }, { time: "17:30", name: "Reformer Pilates", spots: 1 }, { time: "19:00", name: "Pilates Flow", spots: 4 }] },
  { day: "Kedd", classes: [{ time: "08:00", name: "Power Pilates", spots: 2 }, { time: "12:00", name: "Mat Pilates", spots: 5 }, { time: "18:00", name: "Reformer Pilates", spots: 0 }] },
  { day: "Szerda", classes: [{ time: "09:00", name: "Pilates Flow", spots: 4 }, { time: "17:30", name: "Mat Pilates", spots: 6 }, { time: "19:00", name: "Power Pilates", spots: 2 }] },
  { day: "Csutortok", classes: [{ time: "08:00", name: "Reformer Pilates", spots: 1 }, { time: "12:00", name: "Pilates Flow", spots: 5 }, { time: "18:00", name: "Mat Pilates", spots: 3 }] },
  { day: "Pentek", classes: [{ time: "09:00", name: "Power Pilates", spots: 2 }, { time: "17:00", name: "Reformer Pilates", spots: 0 }, { time: "18:30", name: "Pilates Flow", spots: 6 }] },
];

export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="idopontok"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Decorative */}
      <motion.div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] rounded-full bg-sage/5 blur-3xl" />
      <motion.div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-warm/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-sm tracking-[0.3em] uppercase text-warm-dark/70 mb-6"
            >
              Orarend
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] text-brown-deep"
            >
              Heti <span className="italic text-warm-dark">idopontok</span>
            </motion.h2>
          </div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            href="#foglalj"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm tracking-widest uppercase text-brown-deep hover:text-warm-dark transition-colors group"
          >
            Osszes idopont
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </motion.a>
        </div>

        {/* Schedule grid */}
        <div className="space-y-4">
          {schedule.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: dayIndex * 0.08 + 0.2 }}
              className="group"
            >
              <div className="grid grid-cols-12 gap-4 items-start py-6 border-t border-brown-deep/8 group-hover:border-brown-deep/15 transition-colors">
                {/* Day name */}
                <div className="col-span-12 md:col-span-2">
                  <span className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-brown-deep">
                    {day.day}
                  </span>
                </div>

                {/* Classes */}
                <div className="col-span-12 md:col-span-10 grid sm:grid-cols-3 gap-3">
                  {day.classes.map((cls) => {
                    const isFull = cls.spots === 0;
                    return (
                      <div
                        key={`${day.day}-${cls.time}`}
                        className={`relative rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
                          isFull
                            ? "bg-sand/40 opacity-60"
                            : "bg-sand/60 hover:bg-sand hover:shadow-lg hover:shadow-brown-deep/5 hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs tracking-widest uppercase text-brown/40">
                            {cls.time}
                          </span>
                          {isFull ? (
                            <span className="text-[10px] tracking-wider uppercase text-terracotta/70 bg-terracotta/10 px-2 py-0.5 rounded-full">
                              Betelt
                            </span>
                          ) : (
                            <span className="text-[10px] tracking-wider uppercase text-sage/80 bg-sage/10 px-2 py-0.5 rounded-full">
                              {cls.spots} hely
                            </span>
                          )}
                        </div>
                        <h4 className="font-[family-name:var(--font-cormorant)] text-xl font-medium text-brown-deep">
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

        {/* Book CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          id="foglalj"
          className="mt-16 text-center"
        >
          <a
            href="#foglalj"
            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-brown-deep text-cream text-sm tracking-widest uppercase rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brown-deep/20"
          >
            <span className="relative z-10">Online foglals</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
            <div className="absolute inset-0 bg-warm-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </a>
          <p className="mt-4 text-sm text-brown/40 font-light">
            Valaszd ki a szamodra megfelelo idopontot es fizess online
          </p>
        </motion.div>
      </div>
    </section>
  );
}
