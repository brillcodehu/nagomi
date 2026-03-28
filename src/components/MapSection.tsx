"use client";

import Image from "next/image";

export default function MapSection() {
  return (
    <section className="relative w-full bg-foreground overflow-hidden">
      <Image
        src="/footerimage.png"
        alt="Nagomi Pilates Stúdió helyszíne a térképen"
        width={1920}
        height={1920}
        className="w-full h-auto"
        sizes="100vw"
      />
    </section>
  );
}
