"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const rafRef = useRef<number>(0);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    // Desktop only
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 1024) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    function onMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (!visibleRef.current) {
        visibleRef.current = true;
        dot!.style.opacity = "1";
        ring!.style.opacity = "1";
      }

      // Dot follows instantly via transform
      dot!.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    }

    function onLeave() {
      visibleRef.current = false;
      dot!.style.opacity = "0";
      ring!.style.opacity = "0";
    }

    // Ring follows with lerp in rAF
    function tick() {
      const dx = posRef.current.x - ringPosRef.current.x;
      const dy = posRef.current.y - ringPosRef.current.y;
      ringPosRef.current.x += dx * 0.15;
      ringPosRef.current.y += dy * 0.15;

      const scale = isHoveringRef.current ? 2.2 : 1;
      ring!.style.transform = `translate(${ringPosRef.current.x - 18}px, ${ringPosRef.current.y - 18}px) scale(${scale})`;

      rafRef.current = requestAnimationFrame(tick);
    }

    // Hover delegation via event bubbling
    function onPointerOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .cursor-hover")) {
        isHoveringRef.current = true;
        dot!.style.transform = `translate(${posRef.current.x - 3}px, ${posRef.current.y - 3}px) scale(0)`;
      }
    }

    function onPointerOut(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .cursor-hover")) {
        isHoveringRef.current = false;
        dot!.style.transform = `translate(${posRef.current.x - 3}px, ${posRef.current.y - 3}px) scale(1)`;
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
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
          mixBlendMode: "difference",
          willChange: "transform",
          transition: "opacity 0.3s",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
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
          willChange: "transform",
          transition: "opacity 0.3s",
        }}
      />
    </>
  );
}
