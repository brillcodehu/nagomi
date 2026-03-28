"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading theatrical entrance
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(
          ".contact-line-inner"
        );
        gsap.fromTo(
          lines,
          { yPercent: 120, skewY: 5 },
          {
            yPercent: 0,
            skewY: 0,
            duration: 1.3,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Info items line clip wipe reveal
      if (infoRef.current) {
        const items = infoRef.current.querySelectorAll(".contact-info-item");
        gsap.fromTo(
          items,
          {
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          },
          {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            ease: "power3.inOut",
            stagger: 0.12,
            scrollTrigger: {
              trigger: infoRef.current,
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
      id="kapcsolat"
      className="section-scene relative py-28 md:py-40 overflow-hidden"
    >
      {/* Depth 0: Atmospheric gradient */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(154,131,99,0.03), transparent)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
          >
            Kapcsolat
          </motion.span>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground"
            >
              <span className="split-line">
                <span className="contact-line-inner">Kezdd el az</span>
              </span>
              <span className="split-line">
                <span className="contact-line-inner">
                  <span className="italic">utazásod.</span>
                </span>
              </span>
            </h2>

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

        {/* Contact info grid with clip wipe reveal */}
        <div
          ref={infoRef}
          className="grid md:grid-cols-3 gap-0 border-t border-foreground/[0.06]"
        >
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="contact-info-item py-10 md:py-14 md:pr-12 border-b md:border-b-0 md:border-r last:border-b-0 last:border-r-0 border-foreground/[0.06]"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-muted-foreground/50 block mb-5">
                {item.label}
              </span>
              <p className="text-[15px] text-foreground/70 font-light leading-[1.8] whitespace-pre-line">
                {item.value}
              </p>
            </div>
          ))}
        </div>

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
