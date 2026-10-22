"use client";

export default function CookieSettingsButton({
  className = "",
  children = "Süti-beállítások módosítása",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("nagomi:cookie-settings"))}
      className={
        className ||
        "inline-flex items-center min-h-11 px-5 rounded-[6px] border border-foreground/40 text-foreground text-sm hover:bg-foreground hover:text-background transition-colors"
      }
    >
      {children}
    </button>
  );
}
