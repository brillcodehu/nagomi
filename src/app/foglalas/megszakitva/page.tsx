"use client";

import { Suspense } from "react";

function MegszakitvaContent() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Ikon */}
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-8">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-foreground/40"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3vw,2.2rem)] font-medium text-foreground mb-4">
          Fizetés megszakítva
        </h1>

        <p className="text-[14px] text-foreground/60 leading-relaxed mb-8">
          A fizetési folyamat megszakadt. Foglalásod nem jött létre, nem
          történt terhelés. Bármikor újra megpróbálhatod.
        </p>

        <div className="space-y-3">
          <a
            href="/#idopontok"
            className="inline-flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-foreground text-background text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:bg-primary transition-colors duration-300 cursor-pointer"
          >
            Vissza az órarendhez
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-8 py-3.5 text-foreground/50 text-[11px] tracking-[0.15em] uppercase font-medium hover:text-foreground transition-colors duration-300 cursor-pointer"
          >
            Főoldal
          </a>
        </div>

        {/* Brand footer */}
        <p className="mt-16 text-[10px] tracking-[0.2em] uppercase text-foreground/25">
          Nagomi Pilates Studio
        </p>
      </div>
    </main>
  );
}

export default function MegszakitvaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse w-16 h-16 rounded-full bg-muted" />
        </main>
      }
    >
      <MegszakitvaContent />
    </Suspense>
  );
}
