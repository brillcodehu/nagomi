"use client";

const words = [
  "Egyensúly",
  "Erő",
  "Harmónia",
  "Rugalmasság",
  "Légzés",
  "Tudatosság",
  "Reformer",
  "Mélytizom",
  "Regeneráció",
  "Vitalitás",
];

export default function Marquee() {
  const doubled = [...words, ...words];

  return (
    <div className="relative py-10 md:py-14 overflow-hidden border-y border-foreground/[0.06]" aria-hidden="true">
      <div className="mask-fade-x">
        <div
          className="animate-marquee"
          style={{ ["--marquee-duration" as string]: "50s" }}
        >
          <div className="flex items-center gap-10 md:gap-16 whitespace-nowrap w-max">
            {doubled.map((word, i) => (
              <span key={i} className="flex items-center gap-10 md:gap-16">
                <span className="text-[11px] md:text-[13px] tracking-[0.3em] uppercase font-medium text-foreground/15 select-none">
                  {word}
                </span>
                <span className="w-1 h-1 rounded-full bg-foreground/10 shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
