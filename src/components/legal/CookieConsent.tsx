"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nagomi-consent";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // privát mód: a döntés csak az oldal bezárásáig él
  }
}

function applyConsent(choice: Choice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/**
 * Süti-sáv és Google Consent Mode v2. Csak akkor kerül az oldalra, ha van
 * GA4 azonosító (NEXT_PUBLIC_GA_ID). A gtag.js betöltése előtt az alapérték
 * minden tárolásra "denied", a mérés csak elfogadás után indul.
 */
export default function CookieConsent({ gaId }: { gaId: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    const stored = readChoice();
    window.gtag("consent", "default", {
      analytics_storage: stored ?? "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);

    // Az állapotot a következő tick-ben állítjuk be, a hidratálás után.
    const t = window.setTimeout(() => setOpen(stored === null), 0);
    const onOpen = () => setOpen(true);
    window.addEventListener("nagomi:cookie-settings", onOpen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("nagomi:cookie-settings", onOpen);
    };
  }, [gaId]);

  function choose(choice: Choice) {
    saveChoice(choice);
    applyConsent(choice);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Süti-beállítások"
      className="fixed inset-x-3 bottom-3 z-[9999] mx-auto max-w-2xl rounded-[8px] border border-border bg-background p-5 shadow-lg"
    >
      <p className="text-sm leading-relaxed text-foreground">
        A látogatottság névtelenített méréséhez Google Analytics sütit
        használnánk. Mérés csak az engedélyeddel indul. Részletek:{" "}
        <a className="underline underline-offset-4" href="/suti">
          süti-tájékoztató
        </a>
        .
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="min-h-11 flex-1 rounded-[6px] bg-foreground px-5 text-sm font-medium text-background"
        >
          Elfogadom
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="min-h-11 flex-1 rounded-[6px] border border-foreground bg-transparent px-5 text-sm font-medium text-foreground"
        >
          Csak a szükségesek
        </button>
      </div>
    </div>
  );
}
