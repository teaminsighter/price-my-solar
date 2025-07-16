
"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PiggyBank, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

export function CostsSection() {
  return (
    <motion.section 
      id="costs" 
      className="w-full bg-card py-12 md:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="w-full h-[250px] flex items-center justify-center">
              <PiggyBank className="w-24 h-24 text-primary animate-bob" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">The Costs of Going Solar</h3>
            <p className="text-muted-foreground">
              In the last eight years, solar prices have plummeted from around $40,000 to under $9,000 for a standard 3 kW system. For New Zealand homes and businesses, going solar is more affordable than ever.
            </p>
            <p className="text-xs text-muted-foreground/80">Learn more – <Link href="#" className="underline">Freedom Forever</Link></p>
          </div>
          <div className="space-y-6">
            <div className="w-full h-[250px] flex items-center justify-center">
              <LinkIcon className="w-24 h-24 text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Solar and Your NZ Power Company</h3>
            <p className="text-muted-foreground">
              NZ power prices have risen by an average of 5% annually. Exporting solar to the grid only earns you 7-12c/kWh, while grid rates continue to climb. Solar empowers you to control your energy costs.
            </p>
            <p className="text-xs text-muted-foreground/80">Source – <Link href="#" className="underline">CanstarBlue</Link></p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
