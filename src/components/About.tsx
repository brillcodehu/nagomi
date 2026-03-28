"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Stats data
   ═══════════════════════════════════════ */

const stats = [
  { value: 3, suffix: "", label: "Fős csoportok", ghost: "3" },
  { value: 100, suffix: "%", label: "Egyéni figyelem", ghost: "%" },
  { value: 60, suffix: "", label: "Perces órák", ghost: "60" },
  { value: 5, suffix: "★", label: "Google értékelés", ghost: "5" },
];

/* ═══════════════════════════════════════
   Botanical SVGs (unique to About)
   ═══════════════════════════════════════ */

function PampasGrass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M100 500 C98 400 95 300 100 150"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M100 150 C85 120 60 80 40 30" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      <path d="M100 160 C87 130 65 95 48 50" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <path d="M100 145 C80 110 55 70 30 15" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <path d="M100 170 C90 140 72 108 58 65" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
      <path d="M100 155 C82 115 58 75 35 20" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <path d="M100 150 C115 120 140 80 160 30" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      <path d="M100 160 C113 130 135 95 152 50" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <path d="M100 145 C120 110 145 70 170 15" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <path d="M100 170 C110 140 128 108 142 65" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
      <path d="M100 155 C118 115 142 75 165 20" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
    </svg>
  );
}

function EucalyptusBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M75 400 C72 340 68 270 70 200 C72 140 76 80 80 20"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M70 200 C60 170 50 130 55 80"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <ellipse cx="52" cy="55" rx="16" ry="8" transform="rotate(-40 52 55)" fill="currentColor" opacity="0.15" />
      <ellipse cx="102" cy="65" rx="16" ry="8" transform="rotate(35 102 65)" fill="currentColor" opacity="0.15" />
      <ellipse cx="48" cy="110" rx="15" ry="7" transform="rotate(-35 48 110)" fill="currentColor" opacity="0.12" />
      <ellipse cx="98" cy="120" rx="15" ry="7" transform="rotate(30 98 120)" fill="currentColor" opacity="0.12" />
      <ellipse cx="52" cy="165" rx="14" ry="7" transform="rotate(-30 52 165)" fill="currentColor" opacity="0.1" />
      <ellipse cx="95" cy="175" rx="14" ry="7" transform="rotate(28 95 175)" fill="currentColor" opacity="0.1" />
      <ellipse cx="55" cy="220" rx="13" ry="6" transform="rotate(-25 55 220)" fill="currentColor" opacity="0.08" />
      <ellipse cx="92" cy="232" rx="13" ry="6" transform="rotate(25 92 232)" fill="currentColor" opacity="0.08" />
      <ellipse cx="58" cy="278" rx="12" ry="6" transform="rotate(-22 58 278)" fill="currentColor" opacity="0.06" />
      <ellipse cx="88" cy="290" rx="12" ry="6" transform="rotate(22 88 290)" fill="currentColor" opacity="0.06" />
      <ellipse cx="42" cy="100" rx="12" ry="6" transform="rotate(-45 42 100)" fill="currentColor" opacity="0.08" />
      <ellipse cx="40" cy="140" rx="11" ry="5" transform="rotate(-40 40 140)" fill="currentColor" opacity="0.06" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   About component
   ═══════════════════════════════════════ */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentScaleRef = useRef<HTMLDivElement>(null);
  const imageRevealRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* ═══ Reduced motion: show everything, skip animations ═══ */
      if (reduceMotion) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        gsap.set(imageRevealRef.current, { clipPath: "inset(0)" });
        gsap.set(underlineRef.current, { scaleX: 1 });
        gsap.set(verticalLineRef.current, { scaleY: 1 });
        const counterEls =
          statsRef.current?.querySelectorAll<HTMLElement>(".stat-number");
        counterEls?.forEach((el) => {
          el.textContent = `${el.dataset.value}${el.dataset.suffix || ""}`;
        });
        return;
      }

      /* ═══ Section scale entry ═══ */
      if (contentScaleRef.current) {
        gsap.fromTo(
          contentScaleRef.current,
          { scale: 0.97 },
          {
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Label fade in ═══ */
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

      /* ═══ Image clip-path curtain reveal (top → bottom) ═══ */
      if (imageRevealRef.current) {
        gsap.fromTo(
          imageRevealRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: imageRevealRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );

        /* Image parallax (deeper movement) */
        gsap.to(imageRevealRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* ═══ Offset frame parallax (slower than image) ═══ */
      if (frameRef.current) {
        gsap.to(frameRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* ═══ Heading masked line reveal ═══ */
      if (headingRef.current) {
        const lines =
          headingRef.current.querySelectorAll(".about-line-inner");
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

      /* ═══ "művészetté" underline draw ═══ */
      if (underlineRef.current) {
        gsap.fromTo(
          underlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.inOut",
            delay: 0.6,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Vertical accent line draw ═══ */
      if (verticalLineRef.current) {
        gsap.fromTo(
          verticalLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: verticalLineRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Text paragraphs stagger ═══ */
      if (textBlockRef.current) {
        const paragraphs = textBlockRef.current.querySelectorAll("p");
        gsap.fromTo(
          paragraphs,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: textBlockRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Horizontal rule draw ═══ */
      const hr = sectionRef.current?.querySelector(".about-hr");
      if (hr) {
        gsap.fromTo(
          hr,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: hr,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ═══ Stats stagger reveal ═══ */
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(
          items,
          { y: 50, opacity: 0, skewY: 3 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        /* ═══ Counter count-up animation ═══ */
        const counterEls =
          statsRef.current.querySelectorAll<HTMLElement>(".stat-number");
        counterEls.forEach((el) => {
          const target = parseFloat(el.dataset.value || "0");
          const suffix = el.dataset.suffix || "";
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              el.textContent = `${Math.round(proxy.val)}${suffix}`;
            },
          });
        });
      }

      /* ═══ Botanical parallax ═══ */
      const botanicals =
        sectionRef.current?.querySelectorAll<HTMLElement>(".about-botanical");
      botanicals?.forEach((bot, i) => {
        gsap.to(bot, {
          yPercent: i % 2 === 0 ? -15 : 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rolunk"
      className="section-scene relative overflow-hidden"
    >
      {/* ═══ Depth-0: Pilates illustration ghost (atmospheric) ═══ */}
      <div className="depth-layer" aria-hidden="true">
        <div
          className="absolute left-[5%] top-[3%] w-[90%] h-[94%] lg:left-[15%] lg:w-[70%]"
          style={{
            backgroundImage: "url(/pilateshero.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            mixBlendMode: "multiply",
            opacity: 0.045,
            filter: "grayscale(0.4) saturate(0.6)",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 65%)",
          }}
        />
      </div>

      {/* ═══ Depth-0: Organic background blobs ═══ */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 45% 40% at 12% 25%, rgba(154,131,99,0.08), transparent 70%)",
            "radial-gradient(ellipse 40% 45% at 88% 60%, rgba(196,185,154,0.07), transparent 70%)",
            "radial-gradient(ellipse 35% 30% at 55% 90%, rgba(212,201,181,0.06), transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ═══ Depth-0: Fine accent lines ═══ */}
      <div className="depth-layer" aria-hidden="true">
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        <div className="absolute top-0 left-[22%] w-px h-full bg-gradient-to-b from-transparent via-foreground/[0.05] to-transparent hidden lg:block" />
      </div>

      {/* ═══ Depth-0: Botanical elements (desktop only) ═══ */}
      <div className="depth-layer overflow-hidden hidden lg:block" aria-hidden="true">
        <div className="about-botanical absolute right-[-6%] top-[-2%] w-[300px] h-[750px] xl:w-[360px] xl:h-[900px]">
          <PampasGrass className="w-full h-full text-foreground/[0.06] rotate-[12deg]" />
        </div>
        <div className="about-botanical absolute left-[3%] bottom-[-12%] w-[220px] h-[580px] xl:w-[260px] xl:h-[700px]">
          <EucalyptusBranch className="w-full h-full text-primary/[0.07] rotate-[-8deg]" />
        </div>
      </div>

      {/* ═══ Scaled content wrapper ═══ */}
      <div
        ref={contentScaleRef}
        className="py-28 md:py-40"
        style={{ transformOrigin: "center center" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* ═══ Image side ═══ */}
            <div className="relative">
              {/* Offset frame (behind image, slower parallax) */}
              <div
                ref={frameRef}
                className="absolute inset-0 translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 rounded-2xl border border-primary/15"
                aria-hidden="true"
              />

              {/* Image with clip-path curtain reveal */}
              <div
                ref={imageRevealRef}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden image-placeholder"
                style={{ clipPath: "inset(0 0 100% 0)" }}
              >
                <Image
                  src="/studioimg.png"
                  alt="Nagomi Pilates Stúdió belső tere reformer gépekkel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* ═══ Text side ═══ */}
            <div>
              {/* Section label */}
              <span
                ref={labelRef}
                className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
                style={{ opacity: 0, transform: "translateY(15px)" }}
              >
                Rólunk
              </span>

              {/* Masked line reveal heading */}
              <h2
                ref={headingRef}
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground mb-10"
              >
                <span className="split-line">
                  <span className="about-line-inner">Ahol a mozgás</span>
                </span>
                <span className="split-line">
                  <span className="about-line-inner">
                    <span className="relative inline-block">
                      <span className="italic">művészetté</span>
                      <span
                        ref={underlineRef}
                        className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-primary/60 to-primary/20 origin-left"
                        style={{ transform: "scaleX(0)" }}
                        aria-hidden="true"
                      />
                    </span>{" "}
                    válik.
                  </span>
                </span>
              </h2>

              {/* Vertical accent line + paragraphs */}
              <div className="relative pl-6 mb-14" ref={textBlockRef}>
                <div
                  ref={verticalLineRef}
                  className="absolute left-0 top-0 w-[1.5px] h-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent origin-top"
                  style={{ transform: "scaleY(0)" }}
                  aria-hidden="true"
                />
                <div className="space-y-5 text-muted-foreground text-[15px] font-light leading-[1.8]">
                  <p>
                    A Nagomi stúdióban hiszünk abban, hogy a pilates több, mint
                    edzés. Ez egy utazás önmagadhoz, ahol minden mozdulattal
                    közelebb kerülsz a belső egyensúlyodhoz.
                  </p>
                  <p>
                    Képzett oktatóink egyéni figyelmet szentelnek minden
                    vendégnek, hogy biztonságos és hatékony legyen az edzésed.
                    Akár kezdő vagy, akár haladó szintű, nálunk megtalálod a
                    hozzád illő programot.
                  </p>
                </div>
              </div>

              {/* Horizontal rule with draw animation */}
              <div
                className="about-hr border-t border-foreground/[0.06]"
                style={{ transformOrigin: "left" }}
              />

              {/* Stats with count-up + ghost numbers */}
              <div
                ref={statsRef}
                className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-item relative">
                    {/* Ghost number (large, faint background) */}
                    <span
                      className="absolute -top-6 -left-1 font-[family-name:var(--font-playfair)] text-[5rem] font-bold text-foreground/[0.025] select-none pointer-events-none leading-none"
                      aria-hidden="true"
                    >
                      {stat.ghost}
                    </span>
                    {/* Animated counter */}
                    <span
                      className="stat-number font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-foreground relative z-10"
                      data-value={stat.value}
                      data-suffix={stat.suffix}
                    >
                      0{stat.suffix}
                    </span>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 font-medium mt-2 relative z-10">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
