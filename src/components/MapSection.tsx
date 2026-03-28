"use client";

import Image from "next/image";

export default function MapSection() {
  return (
    <section className="relative w-full overflow-hidden bg-foreground">
      {/* The map image, full width */}
      <Image
        src="/footerimage.png"
        alt="Nagomi Pilates Stúdió helyszíne a térképen"
        width={2198}
        height={1952}
        className="relative w-full h-auto block"
        sizes="100vw"
        quality={90}
      />

      {/* Top fade: light page bg → transparent (smooth transition from page above) */}
      <div
        className="absolute top-0 left-0 right-0 h-[30%] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, var(--background) 10%, transparent 100%)",
        }}
      />

      {/* Vignette overlay: edges + bottom tinted with foreground color, center clear */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 30%, var(--foreground) 100%)",
          ].join(", "),
        }}
      />

      {/* Subtle warm color wash across the whole image */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "rgba(43, 42, 32, 0.15)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Bottom edge: hard fade into footer bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, var(--foreground) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
