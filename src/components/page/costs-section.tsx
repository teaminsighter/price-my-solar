import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CostsSection() {
  return (
    <section id="costs" className="w-full bg-card py-12 md:py-20 lg:py-24">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="space-y-6">
          <Image
            src="https://placehold.co/500x300.png"
            alt="Solar panels with stacks of coins"
            width={500}
            height={300}
            className="w-full rounded-lg object-cover"
            data-ai-hint="solar panels coins"
          />
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">The Costs of Going Solar</h3>
          <p className="text-muted-foreground">
            In the last eight years, solar prices have plummeted from around $40,000 to under $9,000 for a standard 3 kW system. For New Zealand homes and businesses, going solar is more affordable than ever.
          </p>
          <p className="text-xs text-muted-foreground/80">Learn more – <Link href="#" className="underline">Freedom Forever</Link></p>
          <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
            <Link href="#get-quotes">Compare 3 Quotes</Link>
          </Button>
        </div>
        <div className="space-y-6">
          <Image
            src="https://placehold.co/500x300.png"
            alt="Home with solar array and power company"
            width={500}
            height={300}
            className="w-full rounded-lg object-cover"
            data-ai-hint="house solar powerlines"
          />
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Solar and Your NZ Power Company</h3>
          <p className="text-muted-foreground">
            NZ power prices have risen by an average of 5% annually. Exporting solar to the grid only earns you 7-12c/kWh, while grid rates continue to climb. Solar empowers you to control your energy costs.
          </p>
          <p className="text-xs text-muted-foreground/80">Source – <Link href="#" className="underline">CanstarBlue</Link></p>
          <Button className="rounded-full" asChild>
            <Link href="#get-quotes">How Much Could You Save?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
