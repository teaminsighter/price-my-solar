import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export function ChoosingPartner() {
  return (
    <section id="partner" className="w-full bg-background py-12 md:py-20 lg:py-24">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
        <div className="relative h-80 w-full flex items-center justify-center">
            <Wrench className="h-32 w-32 text-primary animate-wobble" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choosing the Right Partner
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Look for SEANZ-member installers with strong track records, clear case studies, and compliance with NZ standards. The cheapest quote isn’t always the best. Ask for evidence of previous installs and check Google reviews.
          </p>
          <Button size="lg" className="rounded-full" asChild>
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
