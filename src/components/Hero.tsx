"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ scale }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-muted/30" />

        <motion.div
          style={{ y }}
          className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
          className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          className="absolute top-[30%] left-[30%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-foreground/5 to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <span className="inline-block text-sm tracking-[0.35em] uppercase text-muted-foreground/60 font-light">
            Pilates Studio Budapest
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-cormorant)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight text-foreground mb-8"
        >
          Talalj ra
          <br />
          <span className="italic text-primary">onmagadra</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground/60 font-light max-w-xl mx-auto leading-relaxed mb-12"
        >
          Premium pilates orak egyeni figyelemmel, ahol a tested es lelked
          ujra harmoniaba kerul.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="#foglalj"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background text-sm tracking-widest uppercase rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/20"
          >
            <span className="relative z-10">Foglalj orat</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
            <div className="absolute inset-0 bg-muted-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </a>
          <a
            href="#orak"
            className="inline-flex items-center gap-3 px-10 py-4 text-foreground text-sm tracking-widest uppercase border border-foreground/20 rounded-full hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300"
          >
            Ismerj meg minket
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/30">
          Gorgets
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
