import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Classes from "@/components/Classes";
import Schedule from "@/components/Schedule";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <Marquee />
      <About />
      <Classes />
      <Schedule />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
