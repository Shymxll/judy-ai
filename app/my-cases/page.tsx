import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CasesList } from "@/components/cases-list"

export default function MyCasesPage() {
  return (
    <div className="min-h-screen bg-background grid-background">
      <main className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-heading mb-8 text-center">My Cases</h1>
          <p className="text-xl font-base mb-12 text-center text-foreground/80">
            Track your ongoing and completed cases
          </p>

          <CasesList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
