"use client";

import type { ScheduleSlot } from "@/hooks/useSchedule";

/* ═══════════════════════════════════════
   Difficulty Dots
   ═══════════════════════════════════════ */

function DifficultyDots({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`w-[5px] h-[5px] rounded-full ${
            dot <= level
              ? "bg-primary/60"
              : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ClassCard
   ═══════════════════════════════════════ */

interface ClassCardProps {
  slot: ScheduleSlot;
  isPast: boolean;
  onClick: (slot: ScheduleSlot) => void;
}

export default function ClassCard({ slot, isPast, onClick }: ClassCardProps) {
  const isFull = slot.availableSpots === 0;
  const isDisabled = isPast || isFull;

  return (
    <button
      onClick={() => {
        if (!isDisabled) onClick(slot);
      }}
      disabled={isDisabled}
      className={`schedule-card w-full text-left rounded-xl p-3.5 transition-all duration-300 group ${
        isDisabled
          ? "opacity-40 cursor-default"
          : "bg-muted/40 hover:bg-muted/70 hover:shadow-[0_2px_16px_rgba(154,131,99,0.08)] hover:border-primary/15 cursor-pointer"
      } ${!isDisabled ? "border border-transparent hover:border-primary/15" : "border border-transparent"}`}
      aria-label={`${slot.className} - ${slot.startTime}, ${slot.instructorName}${isFull ? ", betelt" : ""}`}
    >
      {/* Time + availability */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.05em] text-foreground/70 font-medium">
          {slot.startTime}
        </span>
        {isFull ? (
          <span className="flex items-center gap-1">
            <span className="w-[5px] h-[5px] rounded-full bg-destructive/50" />
            <span className="text-[9px] tracking-[0.1em] uppercase font-medium text-destructive/50">
              Betelt
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <span className="w-[5px] h-[5px] rounded-full bg-green-600/60" />
            <span className="text-[9px] tracking-[0.1em] uppercase font-medium text-foreground/40">
              {slot.availableSpots} hely
            </span>
          </span>
        )}
      </div>

      {/* Class name */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[14px] font-medium text-foreground/80 leading-tight">
          {slot.className}
        </span>
        {slot.difficulty > 0 && (
          <DifficultyDots level={slot.difficulty} />
        )}
      </div>

      {/* Instructor */}
      <div className="text-[11px] text-muted-foreground/60 mb-1.5">
        {slot.instructorName}
      </div>

      {/* Price */}
      <div className="text-[11px] font-medium text-primary/70">
        {slot.priceHuf.toLocaleString("hu-HU")} Ft
      </div>

      {/* Private badge */}
      {slot.isPrivate && !isPast && (
        <div className="mt-2">
          <span className="text-[8px] tracking-[0.2em] uppercase font-semibold text-primary/60 border border-primary/20 rounded-full px-2.5 py-0.5">
            1:1 Személyes
          </span>
        </div>
      )}
    </button>
  );
}
