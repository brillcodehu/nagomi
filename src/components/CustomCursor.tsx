"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  const onMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (!visibleRef.current) {
      visibleRef.current = true;
      gsap.to(dotRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(ringRef.current, { opacity: 1, duration: 0.3 });
    }

    gsap.to(dotRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.08,
      ease: "power2.out",
    });
    gsap.to(ringRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.35,
      ease: "power2.out",
    });
  }, []);

  const onLeave = useCallback(() => {
    visibleRef.current = false;
    gsap.to(dotRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(ringRef.current, { opacity: 0, duration: 0.3 });
  }, []);

  useEffect(() => {
    // Desktop only
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 1024) return;

    document.documentElement.classList.add("has-custom-cursor");
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // Magnetic hover on interactive elements
    const onEnterInteractive = () => {
      gsap.to(ringRef.current, {
        scale: 2.2,
        borderColor: "rgba(154,131,99,0.25)",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(dotRef.current, { scale: 0, duration: 0.25 });
    };

    const onLeaveInteractive = () => {
      gsap.to(ringRef.current, {
        scale: 1,
        borderColor: "rgba(154,131,99,0.35)",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(dotRef.current, { scale: 1, duration: 0.25 });
    };

    // Observe DOM for interactive elements (handles dynamically added ones)
    const applyListeners = () => {
      const elements = document.querySelectorAll(
        'a, button, [role="button"], .cursor-hover'
      );
      elements.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
      return elements;
    };

    const elements = applyListeners();

    // Re-apply on DOM changes
    const observer = new MutationObserver(() => {
      applyListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      observer.disconnect();
    };
  }, [onMove, onLeave]);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--primary)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(154,131,99,0.35)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
