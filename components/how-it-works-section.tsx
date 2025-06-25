export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "You and your friend tell your side of the story.",
      description: "Both parties present their perspective on the conflict with detailed arguments.",
    },
    {
      number: "2",
      title: "AI creates a fair law based on your arguments.",
      description: "Our advanced AI analyzes both sides and generates a balanced legal ruling.",
    },
    {
      number: "3",
      title: "The law is published and searchable by others.",
      description: "Your case becomes part of our public database for others to reference.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background grid-background relative overflow-hidden">
      {/* Dekoratif gradyan */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow/5 via-transparent to-red/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading mb-4 text-foreground relative">
            HOW IT WORKS
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow to-red rounded-full"></div>
          </h2>
        </div>

        {/* Adımlar */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="group relative">
              {/* Connecting line (sadece desktop'ta görünür) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-yellow/50 to-transparent z-0"></div>
              )}
              
              {/* Kart */}
              <div className="relative bg-background/80 backdrop-blur-sm p-8 rounded-2xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-background/90">
                {/* Numara circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow to-red rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-heading font-bold text-foreground">
                      {step.number}
                    </span>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-yellow to-red rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>
                
                {/* İçerik */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-heading text-foreground leading-tight group-hover:text-yellow transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Dekoratif köşe */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-yellow/30 rounded-tr-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Alt dekoratif element */}
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gradient-to-r from-yellow to-red rounded-full opacity-60"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}