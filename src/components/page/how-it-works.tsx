import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const steps = [
  {
    title: "Step 1: Capture Sunlight",
    description: "Solar panels on your roof capture sunlight, converting it into DC (Direct Current) electricity.",
  },
  {
    title: "Step 2: Convert to Usable Power",
    description: "An inverter converts the DC electricity into AC (Alternating Current) electricity, which is what your home uses.",
  },
  {
    title: "Step 3: Power Your Home",
    description: "Extra power can charge a home battery for later use or be sent back to the grid, earning you credits.",
  },
  {
    title: "Step 4: Use Your Power",
    description: "You'll always use your own solar power first, which means buying less from your energy retailer and saving money.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-card py-12 md:py-20 lg:py-24">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Solar Works</h2>
            <p className="text-muted-foreground md:text-lg">
                Follow the journey of energy from the sun to your home.
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
           <p className="text-xs text-muted-foreground/80">More info – <Link href="#" className="underline">Vivint Solar</Link></p>
          <Button size="lg" className="rounded-full" asChild>
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
        <div className="relative h-96 w-full rounded-lg bg-muted/50 flex items-center justify-center">
            <Settings className="h-32 w-32 text-primary animate-spin-slow" />
        </div>
      </div>
    </section>
  );
}
