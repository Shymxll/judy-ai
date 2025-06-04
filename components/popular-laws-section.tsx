import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PopularLawsSection() {
  const laws = [
    {
      id: 1,
      title: "The Rule of Fair Sharing in Group Projects",
      caseId: "2025-AI-42",
      summary: "When group members contribute unequally, work distribution should be proportional to effort invested.",
    },
    {
      id: 2,
      title: "Digital Privacy in Shared Devices",
      caseId: "2025-AI-38",
      summary: "Personal data on shared devices requires explicit consent before access by other users.",
    },
    {
      id: 3,
      title: "Social Media Boundary Enforcement",
      caseId: "2025-AI-51",
      summary: "Posting photos of others without permission violates personal autonomy rights.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-blue">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-heading mb-12 text-center text-secondary-background">
          POPULAR AI LAWS
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {laws.map((law) => (
            <div key={law.id} className="neobrutalism-card p-6 bg-yellow rounded-md">
              <h3 className="text-xl font-heading mb-2">{law.title}</h3>
              <p className="text-sm font-base text-foreground/70 mb-2">Case #{law.caseId}</p>
              <p className="text-base font-base">{law.summary}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/browse-laws">
            <Button className="neobrutalism-button bg-yellow text-xl">View All Laws</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
