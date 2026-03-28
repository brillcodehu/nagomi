"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { ScheduleSlot } from "@/hooks/useSchedule";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */

interface BookingModalProps {
  slot: ScheduleSlot | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  hasPass: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const HU_DAY_NAMES = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
const HU_MONTHS = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
];

function formatHungarianDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const dayName = HU_DAY_NAMES[d.getDay()];
  const month = HU_MONTHS[d.getMonth()];
  return `${d.getFullYear()}. ${month} ${d.getDate()}., ${dayName}`;
}

/* ═══════════════════════════════════════
   Validation
   ═══════════════════════════════════════ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = "Kérjük, add meg a neved (min. 2 karakter)";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.email = "Kérjük, adj meg egy érvényes email címet";
  }

  const phoneClean = data.phone.replace(/[\s\-\(\)]/g, "");
  if (phoneClean.length < 9) {
    errors.phone = "Kérjük, adj meg egy érvényes telefonszámot";
  }

  return errors;
}

/* ═══════════════════════════════════════
   Difficulty Dots (modal variant, light)
   ═══════════════════════════════════════ */

function DifficultyDotsLight({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`w-[6px] h-[6px] rounded-full ${
            dot <= level
              ? "bg-primary/70"
              : "bg-background/15"
          }`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Step Indicator
   ═══════════════════════════════════════ */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === current ? "bg-primary w-6" : "bg-background/20"
          }`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════ */

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 2L14 14M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="text-green-500"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M14 24L21 31L34 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9 3L5 7L9 11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   BookingModal
   ═══════════════════════════════════════ */

export default function BookingModal({
  slot,
  isOpen,
  onClose,
}: BookingModalProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    hasPass: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens with a new slot
  useEffect(() => {
    if (isOpen && slot) {
      setStep(0);
      setFormData({ name: "", email: "", phone: "", hasPass: false });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, slot]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // GSAP entrance animation
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(panelRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          delay: 0.05,
        }
      );
    }
  }, [isOpen]);

  // Animate step transitions
  useEffect(() => {
    if (
      !contentRef.current ||
      !isOpen ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }
    );
  }, [step, isOpen]);

  const handleGoToStep2 = useCallback(() => {
    setStep(1);
  }, []);

  const handleGoToStep3 = useCallback(() => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }, [formData]);

  const handlePayWithPass = useCallback(async () => {
    setIsSubmitting(true);
    // Simulates API call - will be replaced with real booking
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep(3);
  }, []);

  const handlePayWithCard = useCallback(async () => {
    setIsSubmitting(true);
    // Simulates redirect to Stripe - will be replaced with real integration
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    // In real implementation: redirect to Stripe checkout
    alert("Stripe fizetési felület megnyitása (hamarosan)");
  }, []);

  if (!isOpen || !slot) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Foglalás: ${slot.className}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/85 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-foreground border border-background/[0.1] rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-background/30 hover:text-background/60 transition-colors z-10 cursor-pointer"
          aria-label="Bezárás"
        >
          <CloseIcon />
        </button>

        <div ref={contentRef} className="p-8 md:p-10">
          {/* ═══ Step 0: Összefoglaló ═══ */}
          {step === 0 && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-primary/50 mb-3">
                Foglalás
              </p>

              <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,1.8rem)] font-medium text-background mb-6">
                {slot.className}
              </h3>

              <p className="font-[family-name:var(--font-playfair)] text-[14px] italic text-primary/50 mb-8">
                {slot.classTagline}
              </p>

              {/* Details grid */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-background/[0.06]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Dátum
                  </span>
                  <span className="text-[14px] text-background/70 font-light">
                    {formatHungarianDate(slot.classDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-background/[0.06]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Időpont
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[14px] text-background/70">
                    {slot.startTime}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-background/[0.06]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Időtartam
                  </span>
                  <span className="text-[14px] text-background/70 font-light">
                    {slot.durationMin} perc
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-background/[0.06]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Oktató
                  </span>
                  <span className="text-[14px] text-background/70 font-light">
                    {slot.instructorName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-background/[0.06]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Nehézség
                  </span>
                  <DifficultyDotsLight level={slot.difficulty} />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-background/[0.06]">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Szabad helyek
                  </span>
                  <span className="text-[14px] text-background/70 font-light">
                    {slot.availableSpots} / {slot.maxSpots}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                  Ár
                </span>
                <span className="font-[family-name:var(--font-playfair)] text-[28px] font-medium text-primary">
                  {slot.priceHuf.toLocaleString("hu-HU")} Ft
                </span>
              </div>

              {/* Step indicator + CTA */}
              <div className="flex items-center justify-between">
                <StepIndicator current={0} total={4} />
                <button
                  onClick={handleGoToStep2}
                  className="px-8 py-3.5 bg-primary/20 text-primary font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-primary/30 transition-all duration-300 cursor-pointer"
                >
                  Tovább
                </button>
              </div>
            </div>
          )}

          {/* ═══ Step 1: Adatok ═══ */}
          {step === 1 && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-primary/50 mb-3">
                Személyes adatok
              </p>

              <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,1.8rem)] font-medium text-background mb-8">
                Adataid megadása
              </h3>

              <div className="space-y-5 mb-8">
                {/* Név */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium mb-2">
                    Név
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Teljes neved"
                    className="w-full bg-background/[0.05] border border-background/[0.08] text-background rounded-xl px-4 py-3 text-[14px] font-light placeholder:text-background/20 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-[11px] text-red-400/80">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="email@pelda.hu"
                    className="w-full bg-background/[0.05] border border-background/[0.08] text-background rounded-xl px-4 py-3 text-[14px] font-light placeholder:text-background/20 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-[11px] text-red-400/80">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Telefonszám */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium mb-2">
                    Telefonszám
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, phone: e.target.value }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+36 30 123 4567"
                    className="w-full bg-background/[0.05] border border-background/[0.08] text-background rounded-xl px-4 py-3 text-[14px] font-light placeholder:text-background/20 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-[11px] text-red-400/80">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Bérlet toggle */}
                <div className="pt-2">
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, hasPass: !prev.hasPass }))
                    }
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    {/* Toggle switch */}
                    <div
                      className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 ${
                        formData.hasPass ? "bg-primary/40" : "bg-background/10"
                      }`}
                    >
                      <div
                        className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-300 ${
                          formData.hasPass
                            ? "left-[22px] bg-primary"
                            : "left-[3px] bg-background/30"
                        }`}
                      />
                    </div>
                    <span className="text-[13px] text-background/50 group-hover:text-background/70 transition-colors">
                      Van bérletem
                    </span>
                  </button>

                  {formData.hasPass && (
                    <p className="mt-3 text-[12px] text-background/25 font-light leading-relaxed pl-[52px]">
                      Foglaláskor ellenorizzuk a bérleted az email címed alapján.
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1.5 text-[11px] text-background/30 hover:text-background/60 transition-colors cursor-pointer"
                  >
                    <ArrowLeftIcon />
                    Vissza
                  </button>
                  <StepIndicator current={1} total={4} />
                </div>
                <button
                  onClick={handleGoToStep3}
                  className="px-8 py-3.5 bg-primary/20 text-primary font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-primary/30 transition-all duration-300 cursor-pointer"
                >
                  Tovább
                </button>
              </div>
            </div>
          )}

          {/* ═══ Step 2: Fizetés ═══ */}
          {step === 2 && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-primary/50 mb-3">
                Fizetés
              </p>

              <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,1.8rem)] font-medium text-background mb-8">
                Fizetési mód
              </h3>

              {/* Booking summary */}
              <div className="bg-background/[0.03] border border-background/[0.06] rounded-xl p-5 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] text-background/60 font-light">
                    {slot.className}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[13px] text-background/60">
                    {slot.startTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] text-background/30 font-light">
                    {formatHungarianDate(slot.classDate)}
                  </span>
                </div>
                <div className="border-t border-background/[0.06] pt-3 flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-medium">
                    Összesen
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-[22px] font-medium text-primary">
                    {slot.priceHuf.toLocaleString("hu-HU")} Ft
                  </span>
                </div>
              </div>

              {/* Payment buttons */}
              <div className="space-y-3 mb-8">
                {formData.hasPass && (
                  <button
                    onClick={handlePayWithPass}
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-primary/20 text-primary font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-primary/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-default"
                  >
                    {isSubmitting ? "Feldolgozás..." : "Fizetés bérletbol"}
                  </button>
                )}

                <button
                  onClick={handlePayWithCard}
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-default ${
                    formData.hasPass
                      ? "border border-background/[0.08] text-background/40 hover:border-background/20 hover:text-background/60"
                      : "bg-primary/20 text-primary hover:bg-primary/30"
                  }`}
                >
                  {isSubmitting ? "Feldolgozás..." : "Fizetés bankkártyával"}
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-[11px] text-background/30 hover:text-background/60 transition-colors cursor-pointer"
                >
                  <ArrowLeftIcon />
                  Vissza
                </button>
                <StepIndicator current={2} total={4} />
              </div>
            </div>
          )}

          {/* ═══ Step 3: Visszaigazolás ═══ */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="flex justify-center mb-6">
                <CheckmarkIcon />
              </div>

              <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.4rem,2.5vw,1.8rem)] font-medium text-background mb-4">
                Foglalásod megerosítve!
              </h3>

              <div className="space-y-2 mb-8">
                <p className="text-[14px] text-background/50 font-light">
                  {slot.className}
                </p>
                <p className="text-[14px] text-background/50 font-light">
                  {formatHungarianDate(slot.classDate)}, {slot.startTime}
                </p>
                <p className="text-[14px] text-background/50 font-light">
                  {slot.instructorName}
                </p>
              </div>

              <p className="text-[12px] text-background/25 font-light mb-8">
                Email visszaigazolást küldtünk a megadott címre.
              </p>

              <div className="flex justify-center">
                <StepIndicator current={3} total={4} />
              </div>

              <button
                onClick={onClose}
                className="mt-8 px-8 py-3.5 bg-primary/20 text-primary font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-primary/30 transition-all duration-300 cursor-pointer"
              >
                Bezárás
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
