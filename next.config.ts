import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap", "lucide-react", "date-fns"],
  },
};

export default nextConfig;
