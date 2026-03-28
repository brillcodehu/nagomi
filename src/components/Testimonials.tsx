"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Horváth Anna",
    role: "3 hónapja jár",
    text: "A Nagomi teljesen megváltoztatta az életem. A hátfájásaim megszűntek és sokkal energikusabbnak érzem magam. Az oktatók hihetetlenül figyelmesek!",
    rating: 5,
  },
  {
    name: "Kiss Katalin",
    role: "1 éve jár",
    text: "Korábban soha nem sportoltam, de itt annyira befogadó és biztató a környezet, hogy minden órát várom. A Reformer órák az abszolút kedvenceim.",
    rating: 5,
  },
  {
    name: "Szabó Dóra",
    role: "6 hónapja jár",
    text: "Prémium élmény, tökéletes hangulat, professzionális oktatás. A Nagomi a hetem fénypontja. Mindenkinek ajánlom, aki keresi a minőséget.",
    rating: 5,
  },
  {
    name: "Tóth Réka",
    role: "8 hónapja jár",
    text: "A Pilates Flow órák segítettek átvészelni egy nagyon stresszes időszakot. A légzéstechnikák amiket itt tanultam, a mindennapjaimban is segítenek.",
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
      className="relative py-28 md:py-40 bg-muted/40 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: heading */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-8"
            >
              Vélemények
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground mb-10"
            >
              Amit <span className="italic">vendégeink</span>
              <br />
              mondanak.
            </motion.h2>

            {/* Dot navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2.5"
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-400 rounded-full ${
                    i === active
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-foreground/10 hover:bg-foreground/25"
                  }`}
                  aria-label={`Vélemény ${i + 1}`}
                />
              ))}
            </motion.div>
          </div>

          {/* Right: testimonial */}
          <div className="flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-8">
                  {Array.from({ length: testimonials[active].rating }).map(
                    (_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )
                  )}
                </div>

                {/* Quote */}
                <p className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,2rem)] font-normal leading-[1.5] text-foreground/85 mb-10">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-playfair)] text-sm font-medium text-primary">
                      {testimonials[active].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground tracking-wide">
                      {testimonials[active].name}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 font-light tracking-wider">
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
