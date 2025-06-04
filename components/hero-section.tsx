import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-foreground text-secondary-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-heading mb-8 leading-tight">
            Let AI Create a Law for Your Conflict
          </h1>

          <p className="text-xl md:text-2xl font-base mb-8 max-w-2xl">
            Argue your case. Let the AI judge. Discover new laws.
          </p>

          <Link href="/start-case">
            <Button className="neobrutalism-button bg-red text-2xl">Start Now</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
