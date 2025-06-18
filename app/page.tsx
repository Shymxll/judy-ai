
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { PopularLawsSection } from "@/components/popular-laws-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PopularLawsSection />
      </main>
    </div>
  )
}
