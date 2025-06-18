import { Header } from "@/components/header"
import { CasesList } from "@/components/cases-list"

export default function MyCasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-heading mb-4">My Cases</h1>
            <p className="text-xl font-base text-muted-foreground max-w-2xl mx-auto">
              Track your ongoing and completed cases
            </p>
          </div>

          <CasesList />
        </div>
      </main>
    </div>
  )
}
