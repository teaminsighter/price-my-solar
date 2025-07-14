import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HybridSystem() {
  return (
    <section id="hybrid" className="w-full bg-secondary text-secondary-foreground py-12 md:py-20 lg:py-24">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
        <div className="relative h-80 w-full">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Hybrid solar system diagram"
            fill
            className="rounded-lg object-cover"
            data-ai-hint="hybrid solar system"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What is a Hybrid System?
          </h2>
          <p className="md:text-lg text-secondary-foreground/80">
            Hybrid solar systems combine solar panels, battery storage, and grid backup for maximum flexibility. They protect you from rising grid prices and blackouts, offering the best of both worlds for ultimate energy independence.
          </p>
          <Button variant="default" size="lg" className="rounded-full" asChild>
            <Link href="#get-quotes">Price My Hybrid & Save</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
