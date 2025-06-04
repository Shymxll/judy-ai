import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b-4 border-border bg-yellow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-4xl font-heading text-foreground">
            JudyAI
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/start-case" className="text-xl font-heading text-foreground hover:underline decoration-4">
              Start a Case
            </Link>
            <Link href="/browse-laws" className="text-xl font-heading text-foreground hover:underline decoration-4">
              Browse AI Laws
            </Link>
            <Link href="/my-cases" className="text-xl font-heading text-foreground hover:underline decoration-4">
              My Cases
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
