"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Horvath Anna",
    role: "3 honapja jar",
    text: "A Nagomi teljesen megvaltoztatta az eletem. A hatfajasaim megszuntek es sokkal energikusabbnak erzem magam. Az oktatok hihetetlenul figyelmesek!",
    rating: 5,
  },
  {
    name: "Kiss Katalin",
    role: "1 eve jar",
    text: "Korabban soha nem sportoltam, de itt annyira befogado es biztato a kornyezet, hogy minden orat varom. A Reformer orak az abszolut kedvenceim.",
    rating: 5,
  },
  {
    name: "Szabo Dora",
    role: "6 honapja jar",
    text: "Premium elmeny, tokeletes hangulat, professzionalis oktatas. A Nagomi a hetem fenypontja. Mindenkinek ajanlom, aki keresi a minoseget.",
    rating: 5,
  },
  {
    name: "Toth Reka",
    role: "8 honapja jar",
    text: "A Pilates Flow orak segitettek athekelni egy nagyon stresszes idoszakot. A legzestechnikak amiket itt tanultam, a mindennapjaimban is segitenek.",
    rating: 5,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="velemenyek"
      className="relative py-32 md:py-48 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/20 overflow-hidden"
    >
      {/* Top line */}
      <div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/20 to-transparent"
        aria-hidden="true"
      />

      {/* Background blob */}
      <div
        className="absolute top-[25%] right-[3%] w-[450px] h-[450px] rounded-full bg-primary/[0.04] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-5 gap-16 md:gap-20">
          {/* Left: heading + controls */}
          <div className="md:col-span-2">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="inline-block text-[11px] tracking-[0.35em] uppercase text-primary/50 mb-6"
            >
              Velemenyek
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-7xl font-light leading-[1.05] text-foreground mb-10"
            >
              Amit{" "}
              <span className="italic text-primary">vendegeink</span>
              <br />
              mondanak
            </motion.h2>

            {/* Giant quote mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 0.05, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-[family-name:var(--font-cormorant)] text-[180px] md:text-[220px] leading-none text-foreground select-none -mt-8"
              aria-hidden="true"
            >
              &ldquo;
            </motion.div>

            {/* Dot navigation */}
            <div className="flex items-center gap-3 -mt-16 md:-mt-20">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-500 rounded-full ${
                    i === active
                      ? "w-8 h-1.5 bg-primary"
                      : "w-1.5 h-1.5 bg-foreground/15 hover:bg-foreground/30"
                  }`}
                  aria-label={`Velemeny ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: testimonial card */}
          <div className="md:col-span-3 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-10">
                  {Array.from({ length: testimonials[active].rating }).map(
                    (_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5 text-primary/60"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )
                  )}
                </div>

                {/* Quote text */}
                <p className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl lg:text-4xl font-light leading-[1.4] text-foreground/90 mb-12">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-chart-3/20 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-cormorant)] text-lg text-foreground/70">
                      {testimonials[active].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/90 tracking-wide">
                      {testimonials[active].name}
                    </p>
                    <p className="text-[12px] text-muted-foreground/50 font-light tracking-wider">
                      {testimonials[active].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
