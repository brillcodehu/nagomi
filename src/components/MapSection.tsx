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

      {/* Vignette overlay: all edges tinted with foreground color, center clear */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 35%, var(--foreground) 100%)",
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
