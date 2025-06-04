import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative w-full py-12 md:py-24 lg:py-32 xl:py-48",
        className
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Beautiful Design Meets Modern Technology
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Experience the perfect blend of aesthetics and functionality in our next-generation web application.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/features">
                <Button size="lg" className="transition-all hover:shadow-lg">
                  Explore Features
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="neutral" className="transition-all hover:bg-accent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px] xl:h-[500px] xl:w-[500px]">
              <div className="absolute inset-0 scale-[0.8] rounded-full bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 blur-3xl"></div>
              <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r from-primary/20 via-primary/5 to-primary/20 blur-xl"></div>
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/30 via-primary/10 to-primary/30 opacity-80"></div>
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-4 shadow-xl sm:h-[350px] sm:w-[350px] lg:h-[400px] lg:w-[400px]">
                <div className="flex h-full w-full flex-col items-center justify-center space-y-6 rounded-lg border border-border p-6">
                  <div className="h-12 w-12 rounded-full bg-primary"></div>
                  <div className="h-4 w-3/4 rounded-full bg-muted"></div>
                  <div className="h-4 w-2/3 rounded-full bg-muted"></div>
                  <div className="h-4 w-1/2 rounded-full bg-muted"></div>
                  <div className="h-10 w-full rounded-md bg-primary/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}