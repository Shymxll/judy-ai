import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Shield, Zap, BarChart, Cloud } from "lucide-react";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Feature({ title, description, icon }: FeatureProps) {
  return (
    <Card className="flex flex-col items-start transition-all hover:shadow-md">
      <CardHeader>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container space-y-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything You Need
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools and features you need to succeed in today's digital landscape.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Lightning Fast"
            description="Optimized for speed and performance on all devices."
            icon={<Zap className="h-6 w-6 text-primary" />}
          />
          <Feature
            title="Secure"
            description="Enterprise-grade security keeps your data safe."
            icon={<Shield className="h-6 w-6 text-primary" />}
          />
          <Feature
            title="Analytics"
            description="Detailed insights to help you make better decisions."
            icon={<BarChart className="h-6 w-6 text-primary" />}
          />
          <Feature
            title="Cloud-based"
            description="Access your content from anywhere, anytime."
            icon={<Cloud className="h-6 w-6 text-primary" />}
          />
        </div>
      </div>
    </section>
  );
}