"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const CIRCLE_TEXT = "NAGOMI  \u2022  REFORMER PILATES  \u2022  DEBRECEN  \u2022  ";

/* ═══════════════════════════════════════
   Inline botanical SVGs
   ═══════════════════════════════════════ */

function MonsteraLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M332.9 17.37c-11.7-.1-24.2 1.23-37.5 4.13c-33.1 7.21-48.6 28.49-56.2 54.09c11.2 22.86 20.1 46.01 25 71.91c-9.6-6.9-19.7-1.7-22.6 5c-4.3-22.4-10-42.9-17.8-62.93c-48.8-34.88-83-20.9-89.6-18.76C49.64 98.12 25.54 165.7 39.84 239.1c19.32-43.4 86.56-68.7 113.56-68.6c6.9.1 47 9.5 13.6 20c-54.8 17.3-98.29 48.7-116.81 86c8.78 24.5 21.34 49.1 36.89 72.4c14.42-42 40.22-89 96.72-125.1c14.5-9.3 23.8.7 12.2 13.2c-53.5 57.4-75.1 104.2-81 148.6c17.4 20.3 37.2 38.9 58.5 54.7c1.6-54.4 20.3-117.7 56.3-164.6c3.7-6.6 22-2.7 15.6 9c-27.9 50.9-43.2 119.9-44.5 174c25.6 15.2 52.9 26.3 80.9 31.9c-15.1-35.2-18.5-80.5-6.9-120.8c5.1-17.8 20.8-8.1 17.6 4.2c-10 38.8 8.6 87.5 28.1 120.6c20.7.1 41.6-3.1 62.3-10.2c11.8-4 22.7-12.3 32.7-23.8c-11.3-22.8-27-44.1-46.6-57.2c-7.4-5-3.2-23.6 10.2-14.8c19.1 12.6 37.6 29.7 52.8 48.7c9.8-16.8 18.2-37 25-59.4c-29.7-34.7-83.3-82-128.8-101.7c-9.6-4.1-8.7-21.5 7.6-16.4c47.8 14.8 98 46.2 131.1 78c3.9-19.9 6.7-40.8 8.1-61.9c-39-27.6-95.5-67.2-147.1-74.8c-9.5-1.4-13.6-18.6 3-17.8c58.3 2.7 109.8 23.5 145.1 50.5c-.5-28.6-3.6-56.7-9.7-82.9c-41.7-13.6-113.5-18.5-141.5-6.1c-11.1 4.9-29.9-4.8-6.8-16.6c37.6-22.1 94.5-22.8 138.3-11c-21.3-57.97-60.7-99.32-123.4-99.83z"
        fill="currentColor"
      />
    </svg>
  );
}

function LotusFlower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M152.313 19.438C138.075 73.11 172.984 126.662 178.25 180.25c-28.744-16.01-71.286-25.18-88.656-43.656c9.36 29.558 51.055 44.096 77.094 66.312c-57.236 1.556-101.637 65.75-148.125 79c54.52 31.628 111.427.296 167.437 23.875c-27.654 34.76-47.284 67.888-57.97 107.283C148.787 384.2 174.07 351.39 198.72 326c-11.686 54.742 1.313 109.477 28.155 164.22c13.028-52.977 67.36-98.796 75.03-157.533c22.665 36.313 53.4 62.266 83.158 103.938c-14.644-51.287-47.12-87.914-64.22-123.625c52.358 5.59 115.075 28.68 168.5 43.47c-29.835-58.79-64.534-103.922-107.78-125.158c33.01.717 70.858 5.604 103.312 10.907c-33.377-19.14-68.513-28.226-110-33.032c49.013-47.885 68.943-95.774 68.406-143.657c-48.033 32.51-96.09 58.57-144.124 74.75c17.206-28.64 40.82-59.57 62-85.468c-35.326 20.535-61.807 48.477-88.22 85.094c-23.716-46.89-79.993-64.068-120.623-120.47zm35.625 72.937c8.325 26.55 49.006 61.23 63.718 91.625c-7.935 2.196-15.188 5.65-21.437 10.063c-9.67-33.43-46.513-71.114-42.282-101.688zm213.28 31.906c-20.144 34.656-47.403 60.806-83 86.72c-2.394-7.408-7.083-13.755-13.124-18.563c31.454-17.384 66.972-44.313 96.125-68.156zm-129.812 75.814c6.66.108 12.638 1.57 17.375 3.97c7.22 3.653 11.376 8.906 12.345 15.436s-1.55 13.663-7.53 20.188c-5.983 6.524-15.326 12.01-26.283 14.218c-10.956 2.208-21.094.686-28.312-2.97c-7.218-3.653-11.374-8.906-12.344-15.436s1.55-13.694 7.53-20.22c5.983-6.524 15.328-11.98 26.283-14.186a51.6 51.6 0 0 1 8.03-.97c.977-.04 1.955-.046 2.906-.03m-63.562 30.562a37.3 37.3 0 0 0 .344 7.563c.983 6.622 3.748 12.55 7.718 17.56c-36.236-7.654-91.958 24.29-125.062 10.157c34.23-.804 77.367-27.78 117-35.28m107.5 10.25c43.444 16.685 78.393 35.883 108.406 65.72c-39.556-17.844-87.918-37.4-126.563-45.47c3.768-2.62 7.204-5.558 10.188-8.812c3.177-3.465 5.884-7.328 7.97-11.438zM274.156 271.5l.22.03c-19.568 32.856-17.574 83.757-44.313 131.845c8.36-50.135 3.05-88.19 17.593-130.438c7.4 1.1 15.3.903 23.344-.718c1.07-.217 2.108-.46 3.156-.72z"
        fill="currentColor"
      />
    </svg>
  );
}

function SimpleLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax only on desktop
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], isDesktop ? [1, 0] : [1, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], isDesktop ? [0, 80] : [0, 0]);
  const circleY = useTransform(scrollYProgress, [0, 1], isDesktop ? [0, -40] : [0, 0]);
  const circleScale = useTransform(scrollYProgress, [0, 0.7], isDesktop ? [1, 0.85] : [1, 1]);

  // Botanical parallax (desktop only)
  const leaf1Y = useTransform(scrollYProgress, [0, 1], isDesktop ? [0, -60] : [0, 0]);
  const leaf2Y = useTransform(scrollYProgress, [0, 1], isDesktop ? [0, 40] : [0, 0]);
  const leaf3Y = useTransform(scrollYProgress, [0, 1], isDesktop ? [0, -25] : [0, 0]);

  // Pilates illustration parallax (desktop only)
  const illustrationHazeY = useTransform(scrollYProgress, [0, 1], isDesktop ? [0, -20] : [0, 0]);
  const illustrationLineY = useTransform(scrollYProgress, [0, 1], isDesktop ? [0, -35] : [0, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[700px] overflow-hidden bg-foreground"
    >
      {/* ═══ Rich atmospheric background (single paint, no blur) ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 80% 15%, rgba(154,131,99,0.07), transparent 70%)",
            "radial-gradient(ellipse 55% 50% at 10% 85%, rgba(154,131,99,0.05), transparent 70%)",
            "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(196,185,154,0.03), transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ═══ Pilates illustration: atmospheric haze (depth-0) ═══ */}
      <motion.div
        style={{ y: illustrationHazeY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute left-[-5%] top-[10%] w-[110%] h-[80%] lg:left-[5%] lg:top-[12%] lg:w-[90%] lg:h-[88%]"
          style={{
            backgroundImage: "url(/pilateshero.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(45px) brightness(1.2) saturate(0.3)",
            mixBlendMode: "screen" as const,
            opacity: 0.04,
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 55%, black, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 55%, black, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ═══ Pilates illustration: line-art ghost (depth-1) ═══ */}
      <motion.div
        style={{ y: illustrationLineY }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute left-[-5%] top-[12%] w-[110%] h-[78%] lg:left-[8%] lg:top-[15%] lg:w-[84%] lg:h-[85%]"
          style={{
            backgroundImage: "url(/pilateshero.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter:
              "invert(1) sepia(1) saturate(0.35) hue-rotate(5deg) brightness(0.85) contrast(1.5)",
            mixBlendMode: "screen" as const,
            opacity: 0.069,
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 55%, black 15%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 55%, black 15%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* ═══ Ghost kanji 和 (harmony = nagomi) ═══ */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[min(70vw,700px)] font-bold leading-none select-none"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(245, 240, 232, 0.025)",
          }}
        >
          和
        </span>
      </div>

      {/* ═══ Fine accent lines (CSS only, no animation on mobile) ═══ */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.04] to-transparent" />
        <div className="absolute top-[75%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.03] to-transparent" />
        <div className="absolute top-0 right-[33%] w-px h-full bg-gradient-to-b from-transparent via-background/[0.03] to-transparent hidden lg:block" />
      </div>

      {/* ═══ Botanical elements (desktop only, 3D depth) ═══ */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        aria-hidden="true"
        style={{ perspective: "1200px" }}
      >
        {/* Large monstera - right side, behind circle */}
        <motion.div
          style={{ y: leaf1Y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          className="absolute right-[2%] top-[8%] w-[340px] h-[340px] xl:w-[420px] xl:h-[420px]"
        >
          <motion.div
            animate={{
              rotateY: [0, 8, 0, -5, 0],
              rotateX: [0, -4, 0, 3, 0],
              rotateZ: [0, 1.5, 0, -1, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <MonsteraLeaf className="w-full h-full text-primary/[0.10] rotate-[-15deg]" />
          </motion.div>
        </motion.div>

        {/* Lotus - left side, lower */}
        <motion.div
          style={{ y: leaf2Y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 2, ease: "easeOut" }}
          className="absolute left-[-2%] bottom-[10%] w-[200px] h-[200px] xl:w-[260px] xl:h-[260px]"
        >
          <motion.div
            animate={{
              rotateY: [0, -6, 0, 4, 0],
              rotateX: [0, 5, 0, -3, 0],
              rotateZ: [0, -2, 0, 1.5, 0],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <LotusFlower className="w-full h-full text-secondary/[0.08] rotate-[25deg]" />
          </motion.div>
        </motion.div>

        {/* Small leaf accent - top left area */}
        <motion.div
          style={{ y: leaf3Y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.5 }}
          className="absolute left-[15%] top-[18%] w-[60px] h-[60px] xl:w-[80px] xl:h-[80px]"
        >
          <motion.div
            animate={{
              rotate: [0, 10, 0, -8, 0],
              y: [0, -8, 0, 6, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <SimpleLeaf className="w-full h-full text-primary/[0.12] rotate-[45deg]" />
          </motion.div>
        </motion.div>

        {/* Tiny leaf accent - bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
          className="absolute right-[20%] bottom-[22%] w-[40px] h-[40px]"
        >
          <motion.div
            animate={{
              rotate: [0, -15, 0, 12, 0],
              y: [0, 6, 0, -4, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
          >
            <SimpleLeaf className="w-full h-full text-secondary/[0.10] rotate-[-30deg] scale-x-[-1]" />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ Mobile botanical (static, no animation) ═══ */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        aria-hidden="true"
      >
        <div className="absolute right-[-8%] top-[5%] w-[200px] h-[200px]">
          <MonsteraLeaf className="w-full h-full text-primary/[0.06] rotate-[-20deg]" />
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full flex items-end pb-[18vh] md:pb-[14vh] lg:items-center lg:pb-0 pt-[100px] md:pt-[110px] lg:pt-[10vh]"
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-[1fr,auto] gap-12 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl"
            >
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] uppercase text-background/25 mb-10">
                Premium Reformer Pilates &middot; Debrecen
              </p>

              <h1 className="mb-8">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.2, delay: 0.5, ease }}
                    className="block font-[family-name:var(--font-playfair)] text-[clamp(3rem,8.5vw,8rem)] font-medium leading-[0.9] tracking-[-0.03em] text-background"
                  >
                    Találj rá
                  </motion.span>
                </span>
                <span className="block overflow-hidden mt-1">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.2, delay: 0.7, ease }}
                    className="block font-[family-name:var(--font-playfair)] text-[clamp(3rem,8.5vw,8rem)] font-medium leading-[0.9] tracking-[-0.03em] text-background/85 italic"
                  >
                    önmagadra.
                  </motion.span>
                </span>
              </h1>

              <div className="w-20 h-[1.5px] bg-gradient-to-r from-primary/50 to-transparent mb-10" />

              <p className="text-[15px] md:text-[16px] text-background/30 font-light max-w-md leading-[1.85] mb-12">
                Kis csoportos reformer pilates órák egyéni figyelemmel.
                Ahol a tested és lelked újra harmóniába kerül.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a
                  href="#foglalj"
                  className="group inline-flex items-center gap-3 px-8 py-4
                    bg-primary text-primary-foreground
                    font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase
                    rounded-full hover:bg-background hover:text-foreground
                    transition-all duration-400"
                >
                  <span>Foglalj órát</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    <path
                      d="M1 9L9 1M9 1H3M9 1V7"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="#rolunk"
                  className="inline-flex items-center gap-3 px-8 py-4
                    text-background/35
                    font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase
                    border border-background/[0.08] rounded-full
                    hover:border-background/20 hover:text-background/55
                    transition-all duration-400"
                >
                  Ismerd meg a stúdiót
                </a>
              </div>
            </motion.div>

            {/* Rotating circular text */}
            <motion.div
              style={{ y: circleY, scale: circleScale }}
              className="hidden lg:flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.4, delay: 1.2, ease }}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <svg
                    viewBox="0 0 300 300"
                    className="w-[220px] h-[220px] xl:w-[280px] xl:h-[280px]"
                  >
                    <defs>
                      <path
                        id="heroCirclePath"
                        d="M 150,150 m -115,0 a 115,115 0 1,1 230,0 a 115,115 0 1,1 -230,0"
                      />
                    </defs>
                    <text
                      fill="rgba(245,240,232,0.1)"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10.5px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      <textPath href="#heroCirclePath" startOffset="0%">
                        {CIRCLE_TEXT}
                        {CIRCLE_TEXT}
                      </textPath>
                    </text>
                  </svg>
                </motion.div>

                {/* Center crosshair + pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-7 h-7">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-background/[0.06]" />
                    <div className="absolute top-0 left-1/2 w-px h-full bg-background/[0.06]" />
                    <motion.div
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-primary/50"
                    />
                  </div>
                </div>

                {/* Outer ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[85%] h-[85%] rounded-full border border-background/[0.03]" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
