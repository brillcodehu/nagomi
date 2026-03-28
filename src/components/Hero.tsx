"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[700px] flex items-center overflow-hidden"
    >
      {/* Background image placeholder */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 image-placeholder" />
        <div className="absolute inset-0 bg-foreground/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-16"
      >
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="text-[11px] tracking-[0.35em] uppercase font-medium text-background/60 mb-8"
        >
          Premium Reformer Pilates Budapest
        </motion.p>

        {/* Headline */}
        <h1 className="mb-10">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.2, delay: 0.5, ease }}
              className="block font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-background"
            >
              Találj rá
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.2, delay: 0.65, ease }}
              className="block font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-background italic"
            >
              önmagadra.
            </motion.span>
          </span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
          className="text-[15px] md:text-[17px] text-background/50 font-light max-w-lg leading-[1.7] mb-12"
        >
          Kis csoportos reformer pilates órák egyéni figyelemmel,
          ahol a tested és lelked újra harmóniába kerül.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <a
            href="#foglalj"
            className="inline-flex items-center gap-3 px-9 py-4 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:bg-background hover:text-foreground transition-all duration-400"
          >
            Foglalj órát
            <span className="text-[10px]">&#x2197;</span>
          </a>
          <a
            href="#rolunk"
            className="inline-flex items-center gap-3 px-9 py-4 text-background/70 text-[11px] tracking-[0.2em] uppercase font-medium border border-background/20 rounded-full hover:bg-background/10 hover:border-background/40 transition-all duration-400"
          >
            Ismerd meg a stúdiót
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-background/25 font-medium">
          Görgess
        </span>
        <div className="w-[1px] h-10 bg-background/15 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-1/2 bg-background/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
