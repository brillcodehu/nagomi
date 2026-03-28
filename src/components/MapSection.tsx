"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Decorative SVG
   ═══════════════════════════════════════ */

function PinDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M100 0C55.8 0 20 35.8 20 80c0 60 80 190 80 190s80-130 80-190C180 35.8 144.2 0 100 0z"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <circle
        cx="100"
        cy="80"
        r="30"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        gsap.set(mapFrameRef.current, { opacity: 1, clipPath: "inset(0)" });
        return;
      }

      /* Label fade */
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
        const lines =
          headingRef.current.querySelectorAll(".map-line-inner");
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

      /* Map frame curtain reveal */
      if (mapFrameRef.current) {
        gsap.fromTo(
          mapFrameRef.current,
          { clipPath: "inset(0 0 100% 0)", opacity: 0.5 },
          {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: mapFrameRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Address stagger */
      if (addressRef.current) {
        const items = addressRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.4,
            scrollTrigger: {
              trigger: addressRef.current,
              start: "top 90%",
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
      className="section-scene relative py-28 md:py-40 bg-foreground overflow-hidden"
    >
      {/* ═══ Depth 0: Atmospheric gradients ═══ */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(154,131,99,0.05), transparent 70%)",
            "radial-gradient(ellipse 40% 35% at 80% 20%, rgba(196,185,154,0.03), transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ═══ Depth 0: Fine accent lines ═══ */}
      <div className="depth-layer hidden lg:block" aria-hidden="true">
        <div className="absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-background/[0.03] to-transparent" />
        <div className="absolute top-0 left-[25%] w-px h-full bg-gradient-to-b from-transparent via-background/[0.025] to-transparent" />
      </div>

      {/* ═══ Depth 0: Decorative SVG ═══ */}
      <div className="depth-layer hidden lg:block" aria-hidden="true">
        <PinDecor className="absolute top-[8%] right-[6%] w-[80px] h-[112px] text-background/[0.025]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* ═══ Header ═══ */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <div>
            <span
              ref={labelRef}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-background/40 mb-8"
              style={{ opacity: 0, transform: "translateY(15px)" }}
            >
              Helyszín
            </span>

            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-background"
            >
              <span className="split-line">
                <span className="map-line-inner">
                  Találj meg
                </span>
              </span>
              <span className="split-line">
                <span className="map-line-inner">
                  <span className="italic text-background/70">minket.</span>
                </span>
              </span>
            </h2>
          </div>

          {/* Address block */}
          <div ref={addressRef} className="mt-8 md:mt-0 md:text-right">
            <p className="text-background/50 text-[15px] font-light leading-[1.8]">
              Debrecen-Józsa
            </p>
            <p className="text-background/50 text-[15px] font-light leading-[1.8]">
              Deák Ferenc utca 2.
            </p>
            <a
              href="https://maps.google.com/?q=Debrecen+Józsa+Deák+Ferenc+utca+2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-[11px] tracking-[0.15em] uppercase font-medium text-primary/70 hover:text-primary transition-colors duration-400"
            >
              <span>Útvonaltervezés</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="translate-y-px"
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
          </div>
        </div>

        {/* ═══ Map frame ═══ */}
        <div
          ref={mapFrameRef}
          className="relative rounded-2xl overflow-hidden border border-background/[0.06]"
          style={{ clipPath: "inset(0 0 100% 0)" }}
        >
          {/* Subtle inner glow at Nagomi pin location */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle 120px at 50% 42%, rgba(154,131,99,0.12), transparent 70%)",
            }}
          />

          {/* Edge vignette within the frame */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            aria-hidden="true"
            style={{
              boxShadow: "inset 0 0 80px 40px rgba(43,42,32,0.5)",
            }}
          />

          <Image
            src="/footerimage.png"
            alt="Nagomi Pilates Stúdió helyszíne a térképen - Debrecen-Józsa, Deák Ferenc utca 2."
            width={2198}
            height={1952}
            className="w-full h-auto block"
            sizes="(max-width: 1400px) 100vw, 1400px"
            quality={90}
          />
        </div>
      </div>
    </section>
  );
}
