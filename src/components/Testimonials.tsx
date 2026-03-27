"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Horvath Anna",
    role: "3 honapja jar",
    text: "A Nagomi teljesen megvaltoztatta az eletetemet. A hatfajasaim megszuntek es sokkal energikusabbnak erzem magam. Az oktatók hihetetlenul figyelmesek!",
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
    text: "Premium elment, tokeletes hangulat, profeszionalis oktatasan. A Nagomi a hetem fenypontja. Mindenkinek ajanlom, aki keresik a minoseget.",
    rating: 5,
  },
  {
    name: "Toth Reka",
    role: "8 honapja jar",
    text: "A Pilates Flow orak segitettek athekelni egy nagyon stresszes idoszakot. A legzestechnikak amiket itt tanultam, a mindennapjaimban is segitenek.",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section
      ref={sectionRef}
      id="velemenyek"
      className="relative py-32 md:py-44 bg-sand/50 overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brown/8 to-transparent" />
      <motion.div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full bg-warm/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left - heading */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-sm tracking-[0.3em] uppercase text-warm-dark/70 mb-6"
            >
              Velemenyek
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-7xl font-light leading-[1.1] text-brown-deep mb-8"
            >
              Amit <span className="italic text-warm-dark">vendgeink</span>
              <br />
              mondanak
            </motion.h2>

            {/* Large quote mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 0.08, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-[family-name:var(--font-cormorant)] text-[200px] leading-none text-brown-deep select-none"
            >
              &ldquo;
            </motion.div>

            {/* Dots navigation */}
            <div className="flex items-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === active
                      ? "w-8 h-2 bg-warm-dark"
                      : "w-2 h-2 bg-brown-deep/20 hover:bg-brown-deep/40"
                  }`}
                  aria-label={`Velemeny ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right - testimonial card */}
          <div className="flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
                className="bg-cream/80 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-xl shadow-brown-deep/5"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-8">
                  {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-warm"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light leading-relaxed text-brown-deep mb-10">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-light/40 to-sand flex items-center justify-center">
                    <span className="font-[family-name:var(--font-cormorant)] text-lg text-brown-deep">
                      {testimonials[active].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-brown-deep">
                      {testimonials[active].name}
                    </p>
                    <p className="text-sm text-brown/40">
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
