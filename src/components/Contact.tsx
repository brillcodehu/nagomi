"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const contactInfo = [
  {
    label: "Stúdió",
    value: "Debrecen-Józsa\nDeák Ferenc utca 2.",
  },
  {
    label: "Email",
    value: "hello@nagomi.hu",
  },
  {
    label: "Nyitvatartás",
    value: "H-P: 07:00 - 21:00\nSzo: 08:00 - 14:00\nV: Zárva",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="kapcsolat"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-8"
          >
            Kapcsolat
          </motion.span>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground"
            >
              Kezdd el az
              <br />
              <span className="italic">utazásod.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-[15px] font-light max-w-sm leading-relaxed"
            >
              Kérdésed van? Írj nekünk vagy látogass el a stúdióba.
              Örülünk, ha személyesen is megismerhetünk.
            </motion.p>
          </div>
        </div>

        {/* Contact info grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="grid md:grid-cols-3 gap-0 border-t border-foreground/[0.06]"
        >
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="py-10 md:py-14 md:pr-12 border-b md:border-b-0 md:border-r last:border-b-0 last:border-r-0 border-foreground/[0.06]"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-muted-foreground/50 block mb-5">
                {item.label}
              </span>
              <p className="text-[15px] text-foreground/70 font-light leading-[1.8] whitespace-pre-line">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex items-center gap-8"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-muted-foreground/40">
            Kövess minket
          </span>
          <div className="w-8 h-px bg-foreground/[0.06]" />
          {["Instagram", "Facebook"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-[12px] tracking-[0.1em] text-foreground/40 hover:text-primary transition-colors duration-400 font-medium"
            >
              {social}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
