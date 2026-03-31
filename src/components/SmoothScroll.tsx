"use client";

import { useEffect, useRef } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);

  useEffect(() => {
    // Delay initialization to avoid blocking first paint
    const rIC = typeof requestIdleCallback === "function" ? requestIdleCallback : (cb: () => void) => setTimeout(cb, 1);
    const timer = rIC(async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });

      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      const cIC = typeof cancelIdleCallback === "function" ? cancelIdleCallback : clearTimeout;
      cIC(timer);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
