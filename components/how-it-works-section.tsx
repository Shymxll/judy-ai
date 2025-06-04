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
    <section className="py-16 md:py-24 bg-background grid-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-heading mb-12 text-center">HOW IT WORKS</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="neobrutalism-card p-8">
              <div className="text-6xl font-heading mb-4 text-yellow">{step.number}</div>
              <h3 className="text-2xl font-heading mb-4">{step.title}</h3>
              <p className="text-lg font-base text-foreground/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
