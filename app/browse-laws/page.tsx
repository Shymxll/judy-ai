import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LawsGrid } from "@/components/laws-grid"
import { SearchBar } from "@/components/search-bar"

export default function BrowseLawsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4 grid-background">
          <h1 className="text-4xl md:text-6xl font-heading mb-8 text-center ">Browse AI Laws</h1>
          <p className="text-xl font-base mb-12 text-center text-foreground/80">
            Discover laws created by artificial intelligence from real conflicts
          </p>

          <SearchBar />
          <LawsGrid />
        </div>
      </main>
    </div>
  )
}
