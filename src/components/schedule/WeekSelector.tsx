"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface WeekSelectorProps {
  weekLabel: string;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
}

export default function WeekSelector({
  weekLabel,
  onPrev,
  onNext,
  canGoPrev,
}: WeekSelectorProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const prevLabel = useRef(weekLabel);

  useEffect(() => {
    if (
      prevLabel.current !== weekLabel &&
      labelRef.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
    }
    prevLabel.current = weekLabel;
  }, [weekLabel]);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Previous week */}
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="Előző hét"
        className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
          canGoPrev
            ? "border-foreground/10 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
            : "border-foreground/5 text-foreground/15 cursor-not-allowed"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 3L5 7L9 11"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Week label */}
      <span
        ref={labelRef}
        className="text-[13px] sm:text-[14px] font-medium text-foreground/70 min-w-[140px] text-center select-none"
      >
        {weekLabel}
      </span>

      {/* Next week */}
      <button
        onClick={onNext}
        aria-label="Következő hét"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/10 text-foreground/50 hover:border-foreground/30 hover:text-foreground transition-all duration-300 cursor-pointer"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 3L9 7L5 11"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
