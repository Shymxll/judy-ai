import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CaseCreationForm } from "@/components/case-creation-form"

export default function StartCasePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-heading mb-8 text-center">Start a New Case</h1>
            <p className="text-xl font-base mb-12 text-center text-foreground/80">
              Present your conflict and let AI create a fair resolution
            </p>
            <CaseCreationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
