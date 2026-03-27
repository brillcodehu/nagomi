"use client";

import { motion } from "framer-motion";

const words = [
  "Egyensuly",
  "Ero",
  "Harmonia",
  "Rugalmassag",
  "Legzes",
  "Nyugalom",
  "Tudatossag",
  "Energia",
];

export default function Marquee() {
  return (
    <div className="relative py-10 bg-cream overflow-hidden border-y border-brown-deep/5">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-8 whitespace-nowrap"
      >
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-light italic text-brown-deep/15">
              {word}
            </span>
            <span className="w-2 h-2 rounded-full bg-warm/20" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
