"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LawsGrid } from "@/components/laws-grid"
import { SearchBar } from "@/components/search-bar"
import { useEffect, useState } from "react"
import { fetchAllLaws } from "@/lib/caseService"

export default function BrowseLawsPage() {
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLaws = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchAllLaws()
        setLaws(data)
      } catch (err: any) {
        setError(err.message || "An error occurred.")
      } finally {
        setLoading(false)
      }
    }
    fetchLaws()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main className="py-16">
        <div className="container mx-auto px-4 grid-background">
          <h1 className="text-4xl md:text-6xl font-heading mb-8 text-center ">Browse AI Laws</h1>
          <p className="text-xl font-base mb-12 text-center text-foreground/80">
            Discover laws created by artificial intelligence from real conflicts
          </p>
          <SearchBar />
          {loading && <div className="text-center py-8">Loading...</div>}
          {error && <div className="text-center text-red-600 py-8">{error}</div>}
          {!loading && !error && <LawsGrid laws={laws} />}
        </div>
      </main>
    </div>
  )
}
