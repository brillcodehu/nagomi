"use client";

const wordsRow1 = [
  "Egyensuly",
  "Ero",
  "Harmonia",
  "Rugalmassag",
  "Legzes",
  "Nyugalom",
  "Tudatossag",
  "Energia",
];

const wordsRow2 = [
  "Reformer",
  "Melytizom",
  "Formalas",
  "Kitartas",
  "Osszpontositas",
  "Regeneracio",
  "Vitalitas",
  "Egyensuly",
];

function MarqueeRow({
  words,
  reverse = false,
  speed = "40s",
}: {
  words: string[];
  reverse?: boolean;
  speed?: string;
}) {
  const doubled = [...words, ...words];

  return (
    <div className="relative overflow-hidden mask-fade-x">
      <div
        className={reverse ? "animate-marquee-reverse" : "animate-marquee"}
        style={{ ["--marquee-duration" as string]: speed }}
      >
        <div className="flex items-center gap-8 whitespace-nowrap w-max">
          {doubled.map((word, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-4xl lg:text-5xl font-light italic text-foreground/[0.08] select-none">
                {word}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/15 shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative py-8 md:py-12 space-y-4 md:space-y-6 overflow-hidden" aria-hidden="true">
      <MarqueeRow words={wordsRow1} speed="45s" />
      <MarqueeRow words={wordsRow2} reverse speed="55s" />
    </div>
  );
}
