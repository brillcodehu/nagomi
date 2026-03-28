"use client";

export default function MapSection() {
  return (
    <section className="relative w-full bg-foreground overflow-hidden">
      {/* Atmospheric haze */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/footerimage.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(50px) brightness(1.4) saturate(0.2)",
            mixBlendMode: "screen",
            opacity: 0.07,
          }}
        />
      </div>

      {/* Line-art ghost (visible) */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "1 / 1",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/footerimage.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter:
              "invert(1) sepia(1) saturate(0.35) hue-rotate(5deg) brightness(0.85) contrast(1.5)",
            mixBlendMode: "screen",
            opacity: 0.18,
          }}
        />
      </div>
    </section>
  );
}
