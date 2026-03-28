"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
   SVG Icons
   ═══════════════════════════════════════ */

function GoogleIcon({ className }: { className?: string }) {
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

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} strokeWidth={1.5}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function QuoteDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M0 40V20C0 8.954 8.954 0 20 0h4v12h-4c-4.418 0-8 3.582-8 8v4h12v16c0 4.418-3.582 8-8 8H8c-4.418 0-8-3.582-8-8zm44 0V20C44 8.954 52.954 0 64 0h4v12h-4c-4.418 0-8 3.582-8 8v4h12v16c0 4.418-3.582 8-8 8h-8c-4.418 0-8-3.582-8-8z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Google Rating Badge
   ═══════════════════════════════════════ */

function GoogleRatingBadge({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-center gap-3 mt-10"
    >
      <GoogleIcon className="w-5 h-5 flex-shrink-0" />
      <div className="flex items-center gap-2">
        <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-foreground">
          {GOOGLE_RATING}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className="w-3.5 h-3.5 text-[#FBBC05]"
              filled={i < Math.floor(GOOGLE_RATING)}
            />
          ))}
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground/50 font-light tracking-wide">
        {GOOGLE_REVIEW_COUNT} vélemény
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // GSAP heading reveal
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="velemenyek"
      className="section-scene relative py-28 md:py-40 bg-muted/40 overflow-hidden"
    >
      {/* Depth 0: Ghost text */}
      <div
        className="absolute inset-0 flex items-end pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="ghost-text-light font-[family-name:var(--font-playfair)]"
          style={{
            fontSize: "clamp(6rem, 16vw, 16rem)",
            marginLeft: "-3%",
            marginBottom: "-2%",
          }}
        >
          REVIEWS
        </span>
      </div>

      {/* Depth 0: Decorative quote */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <QuoteDecor className="absolute top-[12%] right-[8%] w-[120px] h-[90px] text-foreground/[0.025] hidden lg:block" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: heading + Google badge */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
            >
              Vélemények
            </motion.span>

            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground mb-10"
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

            {/* Dot navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center -ml-3"
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="p-3 cursor-pointer group"
                  aria-label={`Vélemény ${i + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-400 ${
                      i === active
                        ? "w-8 h-2 bg-primary"
                        : "w-2 h-2 bg-foreground/10 group-hover:bg-foreground/25"
                    }`}
                  />
                </button>
              ))}
            </motion.div>

            {/* Google Rating Badge */}
            <GoogleRatingBadge isInView={isInView} />
          </div>

          {/* Right: testimonial */}
          <div className="flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease }}
              >
                {/* Stars + Google icon */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-0.5">
                    {Array.from({
                      length: testimonials[active].rating,
                    }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-3.5 h-3.5 text-[#FBBC05]"
                        filled
                      />
                    ))}
                  </div>
                  <GoogleIcon className="w-4 h-4 flex-shrink-0" />
                </div>

                {/* Quote */}
                <p className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,2rem)] font-normal leading-[1.5] text-foreground/85 mb-10">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-playfair)] text-sm font-medium text-primary">
                      {testimonials[active].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground tracking-wide">
                      {testimonials[active].name}
                    </p>
                    <p className="text-[11px] text-muted-foreground/50 font-light tracking-wider">
                      Google Review &middot; {testimonials[active].timeAgo}
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
