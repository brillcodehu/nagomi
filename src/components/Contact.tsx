"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      id="kapcsolat"
      className="relative py-32 md:py-44 overflow-hidden"
    >
      {/* Background decorative */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-warm/5 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-sage/5 blur-3xl" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Large CTA section */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm tracking-[0.3em] uppercase text-warm-dark/70 mb-6"
          >
            Kapcsolat
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-8xl font-light leading-[1.05] text-brown-deep mb-8"
          >
            Kezd el az
            <br />
            <span className="italic text-warm-dark">utazasod</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brown/50 font-light max-w-lg mx-auto mb-12"
          >
            Kerdesed van? Irj nekunk vagy latogass el a studioba. Orulunk, ha
            szemlyesen is megismerhetunk.
          </motion.p>
        </div>

        {/* Contact cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: "Studio",
              line1: "Budapest, V. kerulet",
              line2: "Belvaros utca 42.",
              line3: "1. emelet",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: "Email",
              line1: "hello@nagomi.hu",
              line2: "Altalaban 24 oran belul",
              line3: "valaszolunk",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Nyitvatartas",
              line1: "H-P: 07:00 - 21:00",
              line2: "Szo: 08:00 - 14:00",
              line3: "V: zarva",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
              className="group bg-sand/50 hover:bg-sand rounded-3xl p-8 md:p-10 transition-all duration-500 hover:shadow-xl hover:shadow-brown-deep/5 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-brown-deep mb-6 group-hover:bg-warm/10 transition-colors duration-300">
                {card.icon}
              </div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium text-brown-deep mb-4">
                {card.title}
              </h3>
              <div className="space-y-1 text-brown/50 font-light text-sm">
                <p>{card.line1}</p>
                <p>{card.line2}</p>
                <p>{card.line3}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram / Social CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm tracking-widest uppercase text-brown/30 mb-4">
            Kovesd a studiót
          </p>
          <div className="flex items-center justify-center gap-6">
            {["Instagram", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm tracking-wider text-brown-deep/60 hover:text-warm-dark transition-colors duration-300 border-b border-transparent hover:border-warm-dark/30 pb-0.5"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
