import FeaturesSection from "@/components/landing-page/FeaturesSection";
import Footer from "@/components/landing-page/Footer";
import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/HeroSection";
import PricingSection from "@/components/landing-page/PricingSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
