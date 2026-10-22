import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// A /foglalas/sikeres és /foglalas/megszakitva szándékosan nincs benne.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/impresszum`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/adatkezeles`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/suti`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
