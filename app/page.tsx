import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";


export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        
        {/* Keep the final CTA section but modernize it slightly if needed, or remove if redundant. Hero has CTA. */}
        {/* Removing redundant CTA section as requested for "modern design" - cleaner look. */}
      </main>

      <Footer />
    </div>
  );
}
