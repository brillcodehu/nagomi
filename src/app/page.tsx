import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Classes from "@/components/Classes";
import Schedule from "@/components/schedule/Schedule";
import PricingSection from "@/components/schedule/PricingSection";
import Testimonials from "@/components/Testimonials";

import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <Marquee />
      <ScrollReveal type="fade-up">
        <About />
      </ScrollReveal>
      <ScrollReveal type="clip-top">
        <Classes />
      </ScrollReveal>
      <ScrollReveal type="fade-up">
        <Schedule />
      </ScrollReveal>
      <ScrollReveal type="fade-up">
        <PricingSection />
      </ScrollReveal>
      <ScrollReveal type="clip-iris">
        <Testimonials />
      </ScrollReveal>
      <MapSection />
      <Footer />
    </main>
  );
}
