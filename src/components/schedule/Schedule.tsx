"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSchedule, type ScheduleSlot } from "@/hooks/useSchedule";
import WeekSelector from "./WeekSelector";
import ScheduleFilters from "./ScheduleFilters";
import ClassCard from "./ClassCard";
import BookingModal from "./BookingModal";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Decorative SVG
   ═══════════════════════════════════════ */

function GridDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="10"
        y="10"
        width="180"
        height="180"
        stroke="currentColor"
        strokeWidth="0.4"
      />
      <line
        x1="70"
        y1="10"
        x2="70"
        y2="190"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.6"
      />
      <line
        x1="130"
        y1="10"
        x2="130"
        y2="190"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.6"
      />
      <line
        x1="10"
        y1="70"
        x2="190"
        y2="70"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.6"
      />
      <line
        x1="10"
        y1="130"
        x2="190"
        y2="130"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.6"
      />
      <circle
        cx="100"
        cy="100"
        r="40"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Schedule Component
   ═══════════════════════════════════════ */

export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prevWeekKeyRef = useRef<string>("");

  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(0); // For mobile

  const schedule = useSchedule();

  // Set active day to today on mount
  useEffect(() => {
    const todayIdx = schedule.weekDays.findIndex((d) => d.isToday);
    if (todayIdx >= 0) setActiveDay(todayIdx);
  }, [schedule.isCurrentWeek]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = useCallback((slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedSlot(null);
  }, []);

  /* ═══ GSAP Animations ═══ */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Label fade in
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

      // Heading masked reveal
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(
          ".schedule-line-inner"
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

  /* ═══ Cards stagger animation on data change ═══ */
  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const weekKey = schedule.weekStart.toISOString() + JSON.stringify(schedule.filters);

    if (prevWeekKeyRef.current === weekKey) return;
    prevWeekKeyRef.current = weekKey;

    const cards = gridRef.current.querySelectorAll(".schedule-card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.04,
        onComplete: () => {
          gsap.set(cards, { clearProps: "all" });
        },
      }
    );
  }, [schedule.weekStart, schedule.filters, schedule.slots]);

  const today = new Date();

  return (
    <section
      ref={sectionRef}
      id="idopontok"
      className="section-scene relative py-28 md:py-40 overflow-hidden"
    >
      {/* Depth 0: Subtle gradient */}
      <div
        className="depth-layer"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 75% 55%, rgba(154,131,99,0.03), transparent)",
        }}
      />

      {/* Depth 0: Decorative geometric SVG */}
      <div className="depth-layer hidden lg:block" aria-hidden="true">
        <GridDecor className="absolute top-[5%] right-[-3%] w-[280px] h-[280px] text-foreground/[0.025]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
        {/* ═══ Header ═══ */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <div>
            <span
              ref={labelRef}
              className="inline-block text-[11px] tracking-[0.3em] uppercase font-semibold text-foreground/70 mb-8"
              style={{ opacity: 0, transform: "translateY(15px)" }}
            >
              Órarend
            </span>

            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground"
            >
              <span className="split-line">
                <span className="schedule-line-inner">
                  Foglalj <span className="italic">órát.</span>
                </span>
              </span>
            </h2>
          </div>

          <div className="mt-6 md:mt-0">
            <WeekSelector
              weekLabel={schedule.weekLabel}
              onPrev={schedule.goToPrevWeek}
              onNext={schedule.goToNextWeek}
              canGoPrev={schedule.canGoPrev}
            />
          </div>
        </div>

        {/* ═══ Filters ═══ */}
        <div className="mb-10">
          <ScheduleFilters
            filters={schedule.filters}
            onFilterChange={schedule.setFilters}
          />
        </div>

        {/* ═══ Desktop/Tablet Grid (lg+) ═══ */}
        <div ref={gridRef} className="hidden lg:block">
          <div className="grid grid-cols-7 gap-px bg-foreground/[0.04] rounded-2xl overflow-hidden">
            {schedule.weekDays.map((day) => (
              <div
                key={day.dateStr}
                className={`min-h-[320px] p-3 transition-colors duration-300 ${
                  day.isToday
                    ? "bg-primary/[0.04] border-l-2 border-l-primary/20"
                    : "bg-background/60"
                }`}
              >
                {/* Day header */}
                <div className="mb-3 pb-3 border-b border-foreground/[0.06]">
                  <div
                    className={`text-[12px] tracking-[0.12em] uppercase font-semibold ${
                      day.isToday ? "text-primary" : "text-foreground/60"
                    }`}
                  >
                    {day.name}
                  </div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      day.isToday
                        ? "text-primary/60"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {day.dateLabel}
                  </div>
                </div>

                {/* Day classes */}
                <div className="space-y-2">
                  {day.slots.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground/30 font-light pt-4 text-center">
                      Nincs óra
                    </p>
                  ) : (
                    day.slots.map((slot) => {
                      const slotDate = new Date(slot.classDate + "T" + slot.startTime + ":00");
                      const isPast = slotDate < today;
                      return (
                        <ClassCard
                          key={slot.id}
                          slot={slot}
                          isPast={isPast}
                          onClick={handleCardClick}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Mobile/Tablet view ═══ */}
        <div className="lg:hidden">
          {/* Day tabs (horizontal scroll) */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6 -mx-6 px-6 scrollbar-none">
            {schedule.weekDays.map((day, i) => (
              <button
                key={day.dateStr}
                onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                  activeDay === i
                    ? "bg-foreground text-background"
                    : day.isToday
                      ? "bg-primary/10 text-foreground/70"
                      : "bg-muted/50 text-foreground/40"
                }`}
              >
                <div className="text-[11px] tracking-[0.1em] uppercase font-semibold">
                  {day.name.slice(0, 3)}
                </div>
                <div className="text-[10px] mt-0.5 opacity-60">
                  {day.dateLabel}
                </div>
              </button>
            ))}
          </div>

          {/* Active day's cards */}
          <div className="space-y-2">
            {schedule.weekDays[activeDay]?.slots.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[13px] text-muted-foreground/40 font-light">
                  Ezen a napon nincs óra.
                </p>
              </div>
            ) : (
              schedule.weekDays[activeDay]?.slots.map((slot) => {
                const slotDate = new Date(slot.classDate + "T" + slot.startTime + ":00");
                const isPast = slotDate < today;
                return (
                  <ClassCard
                    key={slot.id}
                    slot={slot}
                    isPast={isPast}
                    onClick={handleCardClick}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ═══ Booking Modal ═══ */}
      <BookingModal
        slot={selectedSlot}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
