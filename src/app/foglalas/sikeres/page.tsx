"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SikeresContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    // A Stripe webhook mar kezeli a megerositest,
    // ez az oldal csak visszajelzest ad a felhasznalonak
    if (sessionId) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {status === "loading" && (
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-6" />
            <div className="h-6 bg-muted rounded w-48 mx-auto mb-3" />
            <div className="h-4 bg-muted rounded w-64 mx-auto" />
          </div>
        )}

        {status === "success" && (
          <>
            {/* Siker ikon */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3vw,2.2rem)] font-medium text-foreground mb-4">
              {type === "pass"
                ? "Bérleted aktiválva!"
                : "Foglalásod megerősítve!"}
            </h1>

            <p className="text-[14px] text-foreground/60 leading-relaxed mb-8">
              {type === "pass"
                ? "A bérleted sikeresen aktiváltuk. Mostantól foglalhatsz órákat a bérletedből. Részleteket emailben küldtük."
                : "Az órád sikeresen lefoglaltuk. Email visszaigazolást küldtünk a megadott címre a foglalás részleteivel."}
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
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="text-destructive"
              >
                <path
                  d="M12 9v4m0 4h.01M12 2L2 20h20L12 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3vw,2.2rem)] font-medium text-foreground mb-4">
              Hiba történt
            </h1>

            <p className="text-[14px] text-foreground/60 leading-relaxed mb-8">
              A fizetés feldolgozása során probléma merült fel. Kérjük,
              próbáld újra vagy vedd fel velünk a kapcsolatot.
            </p>

            <a
              href="/#idopontok"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-foreground text-background text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:bg-primary transition-colors duration-300 cursor-pointer"
            >
              Vissza az órarendhez
            </a>
          </>
        )}

        {/* Brand footer */}
        <p className="mt-16 text-[10px] tracking-[0.2em] uppercase text-foreground/25">
          Nagomi Pilates Studio
        </p>
      </div>
    </main>
  );
}

export default function SikeresPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse w-16 h-16 rounded-full bg-muted" />
        </main>
      }
    >
      <SikeresContent />
    </Suspense>
  );
}
