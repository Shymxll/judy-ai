import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CasesList() {
  const cases = [
    {
      id: 1,
      title: "Laptop Borrowing Dispute",
      status: "Pending Friend Response",
      createdAt: "2025-01-15",
      friendEmail: "alex@example.com",
    },
    {
      id: 2,
      title: "Group Project Grade Distribution",
      status: "AI Analysis Complete",
      createdAt: "2025-01-10",
      friendEmail: "sarah@example.com",
      lawId: 42,
    },
    {
      id: 3,
      title: "Shared Apartment Cleaning",
      status: "Waiting for AI Analysis",
      createdAt: "2025-01-08",
      friendEmail: "mike@example.com",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Friend Response":
        return "bg-yellow"
      case "AI Analysis Complete":
        return "bg-green"
      case "Waiting for AI Analysis":
        return "bg-blue"
      default:
        return "bg-secondary-background"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {cases.map((case_) => (
        <div key={case_.id} className="neobrutalism-card p-6 rounded-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-heading mb-2">{case_.title}</h3>
              <p className="text-base font-base text-foreground/70">
                Case #{case_.id} • Created {case_.createdAt}
              </p>
            </div>

            <div className={`px-4 py-2 border-2 border-border rounded-md ${getStatusColor(case_.status)}`}>
              <span className="font-heading text-sm">{case_.status}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-base">
              <span className="font-heading">Friend:</span> {case_.friendEmail}
            </p>
          </div>

          <div className="flex space-x-4">
            <Link href={`/case/${case_.id}`}>
              <Button className="neobrutalism-button bg-blue text-sm">View Details</Button>
            </Link>

            {case_.lawId && (
              <Link href={`/law/${case_.lawId}`}>
                <Button className="neobrutalism-button bg-green text-sm">View Law</Button>
              </Link>
            )}
          </div>
        </div>
      ))}

      {cases.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-heading mb-4">No cases yet</h3>
          <p className="text-lg font-base mb-6">Start your first case to see it here</p>
          <Link href="/start-case">
            <Button className="neobrutalism-button bg-yellow">Start a Case</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
