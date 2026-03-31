"use client";

import { useEffect, useRef } from "react";

type RevealType =
  | "clip-top"
  | "clip-iris"
  | "clip-circle"
  | "fade-up"
  | "curtain";

interface ScrollRevealProps {
  children: React.ReactNode;
  type?: RevealType;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  type = "fade-up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      let animation: gsap.core.Tween;

      switch (type) {
        case "clip-top":
          gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
          animation = gsap.to(el, {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            delay,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 30%",
              toggleActions: "play none none none",
            },
          });
          break;

        case "clip-iris":
          gsap.set(el, {
            clipPath: "inset(40% 30% 40% 30% round 16px)",
          });
          animation = gsap.to(el, {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 1.4,
            delay,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            },
          });
          break;

        case "clip-circle":
          gsap.set(el, { clipPath: "circle(0% at 50% 50%)" });
          animation = gsap.to(el, {
            clipPath: "circle(80% at 50% 50%)",
            duration: 1.6,
            delay,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 20%",
              scrub: 1.5,
            },
          });
          break;

        case "curtain":
          gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
          animation = gsap.to(el, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            delay,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
          break;

        case "fade-up":
        default:
          gsap.set(el, { y: 60, opacity: 0 });
          animation = gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
          break;
      }

      cleanup = () => {
        animation?.scrollTrigger?.kill();
        animation?.kill();
      };
    })();

    return () => cleanup?.();
  }, [type, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
