"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const contactCards = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Studio",
    lines: ["Budapest, V. kerulet", "Belvaros utca 42.", "1. emelet"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Email",
    lines: ["hello@nagomi.hu", "Altalaban 24 oran belul", "valaszolunk"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Nyitvatartas",
    lines: ["H-P: 07:00 - 21:00", "Szo: 08:00 - 14:00", "V: zarva"],
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      id="kapcsolat"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background parallax blobs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[15%] left-[8%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] rounded-full bg-secondary/[0.05] blur-[100px]" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block text-[11px] tracking-[0.35em] uppercase text-primary/50 mb-6"
          >
            Kapcsolat
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl lg:text-[5.5rem] font-light leading-[1] text-foreground mb-8"
          >
            Kezd el az
            <br />
            <span className="italic text-primary">utazasod</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground/50 font-light max-w-md mx-auto text-[15px] leading-relaxed"
          >
            Kerdesed van? Irj nekunk vagy latogass el a studioba. Orulunk, ha
            szemelyesen is megismerhetunk.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {contactCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 + 0.3, ease }}
              className="group bg-muted/25 hover:bg-muted/45 rounded-3xl p-8 md:p-10 transition-all duration-600 hover:shadow-xl hover:shadow-foreground/[0.03] hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center text-foreground/60 mb-7 group-hover:text-primary group-hover:bg-primary/[0.08] transition-all duration-500">
                {card.icon}
              </div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium text-foreground mb-4">
                {card.title}
              </h3>
              <div className="space-y-1.5 text-muted-foreground/50 font-light text-[14px]">
                {card.lines.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 text-center"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/30 mb-5">
            Kovesd a studiot
          </p>
          <div className="flex items-center justify-center gap-8">
            {["Instagram", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[13px] tracking-wider text-foreground/40 hover:text-primary transition-colors duration-500 relative group"
              >
                {social}
                <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-primary/40 transition-all duration-500" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
