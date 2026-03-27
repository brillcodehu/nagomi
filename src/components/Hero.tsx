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
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background layer */}
      <motion.div style={{ scale }} className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/4 left-0 w-full h-px bg-foreground" />
          <div className="absolute top-2/4 left-0 w-full h-px bg-foreground" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-foreground" />
          <div className="absolute top-0 left-1/4 w-px h-full bg-foreground" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-foreground" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-foreground" />
        </div>

        {/* Organic blobs with parallax + morph */}
        <motion.div
          style={{ y: blob1Y }}
          className="absolute -top-[10%] -right-[5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-primary/[0.07] blur-[100px] animate-blob-1"
        />
        <motion.div
          style={{ y: blob2Y }}
          className="absolute -bottom-[5%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent/[0.08] blur-[120px] animate-blob-2"
        />
        <motion.div
          style={{ y: blob3Y }}
          className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-secondary/[0.06] blur-[80px] animate-blob-3"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-4 text-[11px] tracking-[0.4em] uppercase text-muted-foreground/40 font-light">
            <span className="w-8 h-px bg-muted-foreground/20" />
            Pilates Studio Budapest
            <span className="w-8 h-px bg-muted-foreground/20" />
          </span>
        </motion.div>

        {/* Title with line-by-line reveal */}
        <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(3.5rem,11vw,11rem)] font-light leading-[0.85] tracking-tight text-foreground mb-10">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.4, delay: 0.4, ease }}
              className="block"
            >
              Talalj ra
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.4, delay: 0.6, ease }}
              className="block italic text-primary"
            >
              onmagadra
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease }}
          className="text-base md:text-lg text-muted-foreground/50 font-light max-w-md mx-auto leading-relaxed mb-14"
        >
          Premium pilates orak egyeni figyelemmel, ahol a tested es lelked
          ujra harmoniaba kerul.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="#foglalj"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background text-[11px] tracking-[0.2em] uppercase font-light rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/15"
          >
            <span className="relative z-10">Foglalj orat</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out" />
          </a>
          <a
            href="#rolunk"
            className="inline-flex items-center gap-3 px-10 py-4 text-foreground/60 text-[11px] tracking-[0.2em] uppercase font-light border border-foreground/10 rounded-full hover:border-foreground/25 hover:text-foreground transition-all duration-500"
          >
            Ismerd meg a studiot
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/25 font-light">
          Gorgets
        </span>
        <div className="relative w-5 h-8 rounded-full border border-foreground/10">
          <motion.div
            animate={{ y: [2, 12, 2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 rounded-full bg-foreground/30"
          />
        </div>
      </motion.div>
    </section>
  );
}
