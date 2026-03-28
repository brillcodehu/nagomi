"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const CIRCLE_TEXT = "NAGOMI  \u2022  REFORMER PILATES  \u2022  DEBRECEN  \u2022  ";
const GHOST_TEXT = "NAGOMI";

// Split text into character spans for animation
function SplitChars({
  text,
  className = "",
  charClassName = "",
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`split-char ${charClassName}`}
          aria-hidden="true"
          style={{ opacity: 0, transform: "translateY(110%)" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const horizCompRef = useRef<HTMLDivElement>(null);

  // Mouse-following glow (CSS custom properties, zero re-renders)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      e.currentTarget.style.setProperty("--glow-x", `${x}%`);
      e.currentTarget.style.setProperty("--glow-y", `${y}%`);
    },
    []
  );

  // GSAP ScrollTrigger - scroll-driven parallax exit + ghost text parallax
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const section = containerRef.current;
      if (!section) return;

      // Split text character animation on load
      const chars = section.querySelectorAll(".hero-char");
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.03,
        delay: 0.6,
      });

      // Ghost text parallax on scroll
      if (ghostRef.current) {
        gsap.to(ghostRef.current, {
          xPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Content parallax exit on scroll
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: 150,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "70% top",
            scrub: 0.8,
          },
        });
      }

      // Circle element parallax (moves slower, creates depth)
      if (circleRef.current) {
        gsap.to(circleRef.current, {
          y: -80,
          scale: 0.85,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "80% top",
            scrub: 1,
          },
        });
      }

      // Accent line draw
      if (accentRef.current) {
        gsap.fromTo(
          accentRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            delay: 1.8,
            ease: "power3.out",
          }
        );
      }

      // Horizontal composition parallax on scroll
      if (horizCompRef.current) {
        gsap.to(horizCompRef.current, {
          y: 40,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "20% top",
            end: "60% top",
            scrub: 0.8,
          },
        });
      }

      // Scroll indicator fade out on scroll
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "10% top",
            end: "25% top",
            scrub: 0.5,
          },
        });
      }

      // Decorative frame lines parallax
      const frameLines = section.querySelectorAll(".frame-line");
      frameLines.forEach((line, i) => {
        gsap.to(line, {
          y: 40 + i * 20,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "60% top",
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[100svh] min-h-[700px] overflow-hidden bg-foreground"
      style={
        { "--glow-x": "50%", "--glow-y": "50%" } as React.CSSProperties
      }
    >
      {/* ═══ DEPTH 0: Ghost outlined text (far background) ═══ */}
      <div
        ref={ghostRef}
        className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="ghost-text font-[family-name:var(--font-playfair)]"
          style={{
            fontSize: "clamp(10rem, 28vw, 28rem)",
            marginLeft: "-5%",
          }}
        >
          {GHOST_TEXT}
        </span>
      </div>

      {/* ═══ DEPTH 1: Ambient gradient orbs ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[15%] right-[5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-primary/[0.07] blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -left-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-secondary/[0.05] blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 25, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-accent/[0.04] blur-[100px]"
        />
      </div>

      {/* ═══ DEPTH 1: Dot grid ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(245,240,232,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ═══ DEPTH 2: Mouse-following glow ═══ */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(900px circle at var(--glow-x) var(--glow-y), rgba(154,131,99,0.06), transparent 50%)",
        }}
      />

      {/* ═══ DEPTH 2: Decorative frame lines ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.8, delay: 2.2, ease }}
          className="frame-line absolute top-[12%] left-6 lg:left-16 w-px h-[25%] bg-background/[0.05] origin-top"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2.4, ease }}
          className="frame-line absolute bottom-[12%] right-6 lg:right-16 w-[12%] h-px bg-background/[0.05] origin-right"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.7 }}
          className="frame-line absolute top-[12%] right-6 lg:right-16"
        >
          <div className="w-[30px] h-px bg-background/[0.04]" />
          <div className="w-px h-[30px] bg-background/[0.04] absolute top-0 right-0" />
        </motion.div>
      </div>

      {/* ═══ DEPTH 3: Floating particles ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[22%] right-[18%] w-[5px] h-[5px] rounded-full bg-primary/30"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -8, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[28%] left-[12%] w-[3px] h-[3px] rounded-full bg-secondary/30"
        />
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 180, 360],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
          className="absolute top-[55%] right-[42%] w-[22px] h-px bg-background/20"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[75%] right-[25%] w-[4px] h-[4px] rounded-full bg-primary/20"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-[35%] left-[35%] w-[6px] h-[6px] rounded-full bg-primary/15"
        />
        <motion.div
          animate={{
            y: [0, 18, 0],
            x: [0, -12, 0],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
          className="absolute bottom-[18%] right-[38%] w-[18px] h-px bg-background/15"
        />
      </div>

      {/* ═══ DEPTH 4: Main content ═══ */}
      <div
        ref={contentRef}
        className="relative z-10 flex items-center h-full pt-20 md:pt-24"
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-[1fr,auto] gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="max-w-2xl">
              {/* Kicker */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] uppercase text-background/25 mb-10"
              >
                Premium Reformer Pilates &middot; Debrecen
              </motion.p>

              {/* Headline - Split character animation */}
              <h1 className="mb-8">
                <span className="split-line">
                  <SplitChars
                    text="Találj rá"
                    className="block font-[family-name:var(--font-playfair)] text-[clamp(3.2rem,9vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.03em] text-background"
                    charClassName="hero-char"
                  />
                </span>
                <span className="split-line mt-1">
                  <SplitChars
                    text="önmagadra."
                    className="block font-[family-name:var(--font-playfair)] text-[clamp(3.2rem,9vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.03em] text-background/85 italic"
                    charClassName="hero-char"
                  />
                </span>
              </h1>

              {/* Animated accent line */}
              <div
                ref={accentRef}
                className="w-24 h-[1.5px] bg-gradient-to-r from-primary/60 via-primary/30 to-transparent origin-left mb-10"
                style={{ transform: "scaleX(0)" }}
              />

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8, ease }}
                className="text-[15px] md:text-[16px] text-background/30 font-light max-w-md leading-[1.85] mb-12"
              >
                Kis csoportos reformer pilates órák egyéni figyelemmel.
                Ahol a tested és lelked újra harmóniába kerül.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.0, ease }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <a
                  href="#foglalj"
                  className="group inline-flex items-center gap-3 px-8 py-4
                    bg-primary text-primary-foreground
                    font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase
                    rounded-full
                    hover:bg-background hover:text-foreground
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
              </motion.div>
            </div>

            {/* Right: Rotating circular text */}
            <div
              ref={circleRef}
              className="hidden lg:flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -40 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.6, delay: 1.4, ease }}
                className="relative"
              >
                {/* Spinning text ring */}
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

                {/* Center crosshair + dot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-7 h-7">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-background/[0.06] -translate-y-px" />
                    <div className="absolute top-0 left-1/2 w-px h-full bg-background/[0.06] -translate-x-px" />
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
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DEPTH 4: Horizontal composition bar (cinematic lower-third) ═══ */}
      <div
        ref={horizCompRef}
        className="absolute bottom-[100px] left-0 right-0 z-10 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1.2 }}
            className="flex items-center gap-6"
          >
            {/* Left: location coordinates */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.0, duration: 0.8, ease }}
              className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.25em] uppercase text-background/10 shrink-0"
            >
              47.5°N 21.6°E
            </motion.span>

            {/* Animated line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2.8, duration: 1.8, ease }}
              className="flex-1 h-px bg-gradient-to-r from-background/[0.06] via-primary/[0.12] to-background/[0.02] origin-left"
            />

            {/* Right: decorative data points */}
            <div className="flex items-center gap-5 shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.2, duration: 0.8, ease }}
                className="flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-primary/30" />
                <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] uppercase text-background/10">
                  Est. 2018
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.4, duration: 0.8, ease }}
                className="flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-primary/30" />
                <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] uppercase text-background/10">
                  6 fős csoportok
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ DEPTH 4: Vertical side label ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 1.5 }}
        className="absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-background/[0.04]" />
        <span
          className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.35em] uppercase text-background/8"
          style={{ writingMode: "vertical-rl" }}
        >
          Pilates Studio
        </span>
        <div className="w-px h-12 bg-background/[0.04]" />
      </motion.div>

      {/* ═══ DEPTH 5: Scroll indicator ═══ */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1.2 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.4em] uppercase text-background/12">
            Görgess
          </span>
          <div className="w-px h-10 bg-background/[0.05] relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-x-0 h-1/3 bg-primary/25"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
