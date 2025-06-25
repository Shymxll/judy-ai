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
    <section className="py-16 md:py-24 bg-background grid-background relative overflow-hidden">
      {/* Dekoratif gradyan - How It Works ile uyumlu */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue/5 via-transparent to-yellow/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading mb-4 text-foreground relative">
            POPULAR AI LAWS
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue to-yellow rounded-full"></div>
          </h2>
          <p className="text-lg text-foreground/70 mt-6 max-w-2xl mx-auto">
            Discover the most referenced AI-generated laws from our community
          </p>
        </div>

        {/* Laws Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {laws.map((law, index) => (
            <div key={law.id} className="group relative">
              {/* Kart */}
              <div className="relative bg-background/80 backdrop-blur-sm p-8 rounded-2xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-background/90 h-full">
                {/* Üst badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-gradient-to-r from-blue to-yellow text-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    #{law.id}
                  </div>
                  <div className="text-xs text-foreground/50 bg-foreground/5 px-2 py-1 rounded-md">
                    {law.caseId}
                  </div>
                </div>
                
                {/* İçerik */}
                <div className="space-y-4">
                  <h3 className="text-xl font-heading text-foreground leading-tight group-hover:text-blue transition-colors line-clamp-2">
                    {law.title}
                  </h3>
                  <p className="text-base text-foreground/80 leading-relaxed">
                    {law.summary}
                  </p>
                </div>

                {/* Alt dekoratif element */}
                <div className="absolute bottom-4 right-4 w-8 h-8 border border-blue/20 rounded-full flex items-center justify-center group-hover:border-blue/40 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue to-yellow rounded-full"></div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue/5 to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/browse-laws">
            <Button className="relative bg-gradient-to-r from-blue to-yellow text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold overflow-hidden group">
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue to-yellow opacity-0 group-hover:opacity-20 transition-opacity rounded-xl blur-lg"></div>
              <span className="relative">View All Laws</span>
              {/* Arrow icon */}
              <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>

        {/* Alt dekoratif pattern */}
        <div className="mt-16 flex justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-gradient-to-t from-blue/40 to-yellow/40 rounded-full animate-pulse"
              style={{ 
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}