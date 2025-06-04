import Link from "next/link"

export function LawsGrid() {
  const laws = [
    {
      id: 1,
      title: "The Rule of Fair Sharing in Group Projects",
      caseId: "2025-AI-42",
      summary:
        "When group members contribute unequally to a project, the final grade and recognition should be distributed proportionally to the effort and quality of work contributed by each member.",
      category: "Education",
      votes: { fair: 156, unfair: 23 },
    },
    {
      id: 2,
      title: "Digital Privacy in Shared Devices",
      caseId: "2025-AI-38",
      summary:
        "Personal data, messages, and files on shared devices require explicit consent before access by other users, regardless of device ownership.",
      category: "Technology",
      votes: { fair: 203, unfair: 45 },
    },
    {
      id: 3,
      title: "Social Media Boundary Enforcement",
      caseId: "2025-AI-51",
      summary:
        "Posting photos or information about others on social media without their explicit permission violates personal autonomy rights.",
      category: "Social Media",
      votes: { fair: 189, unfair: 67 },
    },
    {
      id: 4,
      title: "Roommate Cleaning Responsibilities",
      caseId: "2025-AI-29",
      summary:
        "In shared living spaces, cleaning duties must be distributed equally unless alternative arrangements are mutually agreed upon in writing.",
      category: "Living",
      votes: { fair: 134, unfair: 89 },
    },
    {
      id: 5,
      title: "Borrowed Item Return Policy",
      caseId: "2025-AI-67",
      summary:
        "Items borrowed between friends must be returned in the same condition within an agreed timeframe, with replacement required for damage.",
      category: "Property",
      votes: { fair: 178, unfair: 34 },
    },
    {
      id: 6,
      title: "Group Chat Etiquette Standards",
      caseId: "2025-AI-83",
      summary:
        "Adding someone to a group chat without their consent, especially for commercial purposes, constitutes digital harassment.",
      category: "Communication",
      votes: { fair: 245, unfair: 12 },
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {laws.map((law) => (
        <Link key={law.id} href={`/law/${law.id}`}>
          <div className="neobrutalism-card p-6 hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer rounded-md">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-yellow border-2 border-border text-sm font-heading rounded-md">
                {law.category}
              </span>
            </div>

            <h3 className="text-xl font-heading mb-2">{law.title}</h3>

            <p className="text-sm font-base text-foreground/70 mb-3">Case #{law.caseId}</p>

            <p className="text-base font-base mb-4 line-clamp-3">{law.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">👍</span>
                  <span className="font-heading">{law.votes.fair}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">👎</span>
                  <span className="font-heading">{law.votes.unfair}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
