import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import CookieConsent from "@/components/legal/CookieConsent";
import { GA_ID, INDEXING_ENABLED, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  robots: INDEXING_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Nagomi | Pilates Studio Debrecen",
    description:
      "Premium reformer pilates studio Debrecenben. Egyéni figyelem, kis csoportos órák, professzionális oktatók.",
  },
  title: "Nagomi | Pilates Studio Debrecen",
  description:
    "Premium reformer pilates studio Debrecenben. Egyéni figyelem, kis csoportos órák, professzionális oktatók.",
  keywords: [
    "pilates",
    "reformer pilates",
    "studio",
    "nagomi",
    "debrecen",
    "wellness",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${inter.variable} ${playfair.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain-overlay">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CustomCursor />
        {GA_ID && <CookieConsent gaId={GA_ID} />}
      </body>
    </html>
  );
}
