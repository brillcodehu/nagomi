"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */

const GOOGLE_RATING = 4.9;
const GOOGLE_REVIEW_COUNT = 47;

const testimonials = [
  {
    name: "Horváth Anna",
    text: "A Nagomi teljesen megváltoztatta az életem. A hátfájásaim megszűntek és sokkal energikusabbnak érzem magam. Az oktatók hihetetlenül figyelmesek!",
    rating: 5,
    timeAgo: "3 hónapja",
  },
  {
    name: "Kiss Katalin",
    text: "Korábban soha nem sportoltam, de itt annyira befogadó és biztató a környezet, hogy minden órát várom. A Reformer órák az abszolút kedvenceim.",
    rating: 5,
    timeAgo: "1 éve",
  },
  {
    name: "Szabó Dóra",
    text: "Prémium élmény, tökéletes hangulat, professzionális oktatás. A Nagomi a hetem fénypontja. Mindenkinek ajánlom, aki keresi a minőséget.",
    rating: 5,
    timeAgo: "6 hónapja",
  },
  {
    name: "Tóth Réka",
    text: "A Pilates Flow órák segítettek átvészelni egy nagyon stresszes időszakot. A légzéstechnikák amiket itt tanultam, a mindennapjaimban is segítenek.",
    rating: 5,
    timeAgo: "8 hónapja",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ═══════════════════════════════════════
   Decorative SVGs
   ═══════════════════════════════════════ */

function QuoteDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 62V30C0 13.431 13.431 0 30 0h6v18h-6c-6.627 0-12 5.373-12 12v6h18v26c0 6.627-5.373 12-12 12H12C5.373 74 0 68.627 0 62z"
        fill="currentColor"
      />
      <path
        d="M66 62V30C66 13.431 79.431 0 96 0h6v18h-6c-6.627 0-12 5.373-12 12v6h18v26c0 6.627-5.373 12-12 12H78c-6.627 0-12-5.373-12-12z"
        fill="currentColor"
      />
    </svg>
  );
}

function DiamondDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="100"
        y="5"
        width="134"
        height="134"
        transform="rotate(45 100 5)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <rect
        x="100"
        y="25"
        width="106"
        height="106"
        transform="rotate(45 100 25)"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.5"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Google SVG Icons
   ═══════════════════════════════════════ */

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function StarFilled({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const googleBadgeRef = useRef<HTMLDivElement>(null);
  const ratingNumberRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const reviewsFillRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > active ? 1 : -1);
      setActive(i);
    },
    [active]
  );

  /* ═══ GSAP Animations ═══ */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        gsap.set(dividerRef.current, { scaleX: 1 });
        gsap.set(googleBadgeRef.current, { opacity: 1, y: 0 });
        return;
      }

      /* Label fade in */
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: labelRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Heading masked reveal */
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(
          ".testimonial-line-inner"
        );
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Divider draw */
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Google badge stagger */
      if (googleBadgeRef.current) {
        const children = googleBadgeRef.current.children;
        gsap.fromTo(
          children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: googleBadgeRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Rating count-up */
      if (ratingNumberRef.current) {
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: GOOGLE_RATING,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ratingNumberRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            if (ratingNumberRef.current) {
              ratingNumberRef.current.textContent = proxy.val.toFixed(1);
            }
          },
        });
      }

      /* Quote area parallax */
      if (quoteRef.current) {
        gsap.to(quoteRef.current, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* REVIEWS ghost text fill: pin section, fill bottom-to-top, then release */
      if (reviewsFillRef.current && sectionRef.current) {
        gsap.fromTo(
          reviewsFillRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "bottom bottom",
              end: "+=400",
              pin: true,
              scrub: 0.6,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const t = testimonials[active];

  return (
    <section
      ref={sectionRef}
      id="velemenyek"
      className="section-scene relative py-28 md:py-40 overflow-hidden"
    >
      {/* ═══ Depth 0: Atmospheric gradient ═══ */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 50% 45% at 70% 40%, rgba(154,131,99,0.04), transparent 70%)",
            "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(196,185,154,0.03), transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ═══ Depth 0: Fine accent line ═══ */}
      <div className="depth-layer hidden lg:block" aria-hidden="true">
        <div className="absolute top-[45%] left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent" />
      </div>

      {/* ═══ Depth 0: Decorative SVGs ═══ */}
      <div className="depth-layer hidden lg:block" aria-hidden="true">
        <QuoteDecor className="absolute top-[8%] right-[6%] w-[100px] h-[80px] text-foreground/[0.02]" />
        <DiamondDecor className="absolute bottom-[10%] left-[3%] w-[180px] h-[180px] text-foreground/[0.02]" />
      </div>

      {/* ═══ Depth 0: Ghost text with scroll fill ═══ */}
      <div
        className="absolute inset-0 flex items-end pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Outline layer (always visible) */}
        <span
          className="ghost-text-light font-[family-name:var(--font-playfair)] block w-full text-center"
          style={{
            fontSize: "19.5vw",
            marginBottom: "-1.5%",
          }}
        >
          REVIEWS
        </span>
        {/* Solid fill layer (clips from bottom-to-top on scroll) */}
        <span
          ref={reviewsFillRef}
          className="absolute bottom-0 left-0 w-full text-center font-[family-name:var(--font-playfair)]"
          style={{
            fontSize: "19.5vw",
            marginBottom: "-1.5%",
            color: "#2B2A20",
            opacity: 0.15,
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            userSelect: "none",
            clipPath: "inset(100% 0 0 0)",
          }}
        >
          REVIEWS
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* ═══ Google Rating Badge (above everything) ═══ */}
        <div
          ref={googleBadgeRef}
          className="flex items-center gap-5 mb-16 md:mb-20"
        >
          <div className="flex items-center gap-2.5">
            <GoogleLogo className="w-5 h-5" />
            <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-foreground/50">
              Google Reviews
            </span>
          </div>

          <div className="w-px h-4 bg-foreground/[0.08]" />

          <div className="flex items-center gap-2">
            <span
              ref={ratingNumberRef}
              className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-foreground tracking-tight"
            >
              0.0
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarFilled
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(GOOGLE_RATING)
                      ? "text-[#FBBC05]"
                      : "text-foreground/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-4 bg-foreground/[0.08] hidden sm:block" />

          <span className="text-[11px] text-muted-foreground/40 font-light tracking-wide hidden sm:block">
            {GOOGLE_REVIEW_COUNT} vélemény alapján
          </span>
        </div>

        {/* ═══ Main grid ═══ */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
          {/* ═══ Left: Heading + Navigation ═══ */}
          <div>
            <span
              ref={labelRef}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
              style={{ opacity: 0, transform: "translateY(15px)" }}
            >
              Vélemények
            </span>

            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground mb-12"
            >
              <span className="split-line">
                <span className="testimonial-line-inner">
                  Amit <span className="italic">vendégeink</span>
                </span>
              </span>
              <span className="split-line">
                <span className="testimonial-line-inner">mondanak.</span>
              </span>
            </h2>

            {/* Vertical accent line + subtitle */}
            <div className="relative pl-6 mb-12">
              <div
                className="absolute left-0 top-0 w-[1.5px] h-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
                aria-hidden="true"
              />
              <p className="text-muted-foreground text-[15px] font-light leading-[1.8]">
                Vendégeink tapasztalatai a legjobb bizonyíték. Büszkék vagyunk
                minden történetre, ami a stúdiónkban kezdődött.
              </p>
            </div>

            {/* Dot navigation */}
            <div className="flex items-center gap-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="p-2.5 cursor-pointer group"
                  aria-label={`Vélemény ${i + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      i === active
                        ? "w-8 h-[5px] bg-primary"
                        : "w-[5px] h-[5px] bg-foreground/10 group-hover:bg-foreground/25"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-[11px] font-[family-name:var(--font-mono)] text-muted-foreground/40 tabular-nums">
                {String(active + 1).padStart(2, "0")}/{String(testimonials.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ═══ Right: Testimonial card ═══ */}
          <div ref={quoteRef} className="flex items-center">
            <div className="w-full">
              {/* Horizontal divider with draw animation */}
              <div
                ref={dividerRef}
                className="h-px bg-gradient-to-r from-foreground/[0.08] via-foreground/[0.04] to-transparent mb-12 origin-left"
                style={{ transform: "scaleX(0)" }}
              />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({
                      opacity: 0,
                      y: d * 40,
                      filter: "blur(6px)",
                    }),
                    center: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    },
                    exit: (d: number) => ({
                      opacity: 0,
                      y: d * -30,
                      filter: "blur(6px)",
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.65, ease }}
                >
                  {/* Stars row */}
                  <div className="flex items-center gap-0.5 mb-8">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarFilled
                        key={i}
                        className="w-3.5 h-3.5 text-[#FBBC05]"
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <blockquote className="font-[family-name:var(--font-playfair)] text-[clamp(1.35rem,2.2vw,1.85rem)] font-normal leading-[1.55] text-foreground/85 mb-12">
                    <span className="text-primary/30 text-[1.4em] leading-none align-text-top mr-1">
                      &ldquo;
                    </span>
                    {t.text}
                    <span className="text-primary/30 text-[1.4em] leading-none align-text-bottom ml-0.5">
                      &rdquo;
                    </span>
                  </blockquote>

                  {/* Author + Google attribution */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Monogram circle */}
                      <div className="w-11 h-11 rounded-full bg-primary/[0.08] border border-primary/[0.12] flex items-center justify-center">
                        <span className="font-[family-name:var(--font-playfair)] text-sm font-medium text-primary">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground tracking-wide">
                          {t.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <GoogleLogo className="w-3 h-3" />
                          <p className="text-[10px] text-muted-foreground/45 font-light tracking-wider">
                            Google Review &middot; {t.timeAgo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation arrows (desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                      <button
                        onClick={() =>
                          goTo(
                            (active - 1 + testimonials.length) %
                              testimonials.length
                          )
                        }
                        className="w-10 h-10 rounded-full border border-foreground/[0.08] flex items-center justify-center text-foreground/30 hover:text-foreground/60 hover:border-foreground/15 transition-all duration-300 cursor-pointer"
                        aria-label="Előző vélemény"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          goTo((active + 1) % testimonials.length)
                        }
                        className="w-10 h-10 rounded-full border border-foreground/[0.08] flex items-center justify-center text-foreground/30 hover:text-foreground/60 hover:border-foreground/15 transition-all duration-300 cursor-pointer"
                        aria-label="Következő vélemény"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
