import type { MetadataRoute } from "next";
import { INDEXING_ENABLED, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
