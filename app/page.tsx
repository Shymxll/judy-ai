"use client"

import React from "react";

const steps = [
  {
    gif: "/assets/disagreement.gif",
    title: "The Dispute Begins",
    description:
      "You and your friend have a disagreement and can't decide who is right. You can't agree on who is right.",
    icon: "⚖️"
  },
  {
    gif: "/assets/listening.gif",
    title: "Present Your Case",
    description:
      "Bring your case to Judy and explain the situation in detail. Tell it what you think is right and why. You can also bring evidence to support your case.",
    icon: "📝"
  },
  {
    gif: "/assets/asking.gif",
    title: "Cross-Examination",
    description:
      "Judy will ask you all the necessary questions to fully understand the case. Answer them as best you can. ",
    icon: "🔍"
  },
  {
    gif: "/assets/evidence.gif",
    title: "The Verdict",
    description:
      "Based on the evidence and testimony, Judy determines who is right. It will explain its reasoning and give you a verdict.",
    icon: "🧑‍⚖️"
  },
  {
    gif: "/assets/result.gif",
    title: "Precedent Established",
    description:
      "A new social law is created, so others can refer to it in the future. You can also refer to it in the future.  ",
    icon: "📜"
  },
];

// Decorative gavel SVG component
const GavelSVG = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M14 6l-4.5 4.5M12 10l4 4M18 15l-4-4M8.5 8.5L6 11M12 14l-1.5 1.5M3 21h18M17 3l4 4-4 4-4-4z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Decorative scales of justice SVG
const ScalesSVG = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M12 3v18M7 21h10M5 7h4M15 7h4M7 7v4a2 2 0 104 0V7M17 7v4a2 2 0 01-4 0V7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto w-full bg-background">
      {/* Hero Section - Full Width, No Borders */}
      <section className=" w-full grid-background max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center overflow-hidden ">
        <div className="w-full max-w-7xl mx-auto px-4  ">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2  md:mb-0 md:pr-8">
              <div className="text-center md:text-left">
                <span className="inline-block text-6xl mb-8">{steps[0].icon}</span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-amber-900">
                  The Court of Judy
                </h1>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900">
                  {steps[0].title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-800 max-w-2xl">
                  {steps[0].description}
                </p>

                {/* Scroll indicator */}
                <div className="flex items-center mt-10 text-amber-600">
                  <span className="mr-3">Scroll to continue</span>
                  <svg
                    className="w-6 h-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-background/30 rounded-2xl -m-3 blur-xl"></div>
                <img
                  src={steps[0].gif}
                  alt={steps[0].title}
                  className="w-[28rem] h-[28rem] md:w-[24rem] md:h-[24rem] rounded-xl object-cover relative"
                  aria-label={steps[0].title + ' illustration'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Court Proceedings (Steps) - Alternating Layout */}
      <main className="w-full bg-background">
        <div className="max-w-7xl mx-auto h-screen md:h-auto overflow-y-auto snap-y snap-mandatory">

          {steps.slice(1).map((step, idx) => (
            <div
              key={idx + 1}
              className={`w-full max-w-7xl mx-auto flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center  px-4 min-h-screen snap-start`}
              style={{ background: 'var(--background, #f5f5f5)' }}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 flex justify-center mb-12 md:mb-0">
                <div className="relative">
                  <div className="absolute inset-0  rounded-2xl -m-3 blur-xl"></div>
                  <div className="relative">
                    <img
                      src={step.gif}
                      alt={step.title}
                      className="w-80 h-80 rounded-2xl object-cover"
                      aria-label={step.title + ' illustration'}
                    />
                    <div className="absolute -bottom-7 -right-7 w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl ">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 md:px-12">
                <div className={`text-center ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-200 text-amber-900 font-bold text-2xl mb-6">
                    {idx + 2}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-amber-900">
                    {step.title}
                  </h3>
                  <p className="text-xl text-amber-800 max-w-2xl mx-auto md:mx-0">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
