
"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Banknote } from "lucide-react";
import { motion } from "framer-motion";

type SavingsSectionProps = {
  pageVariant: 'Quote' | 'Cost';
};

export function SavingsSection({ pageVariant }: SavingsSectionProps) {

  const content = {
    Quote: {
      headline: "How Much Can I Save?",
      description: "Most NZ households save 40–70% off their power bills with solar. The payback period is usually 7–10 years, depending on your energy usage, available rebates, and system size.",
      button: "Compare Now"
    },
    Cost: {
      headline: "How Much Can I Save?",
      description: "Most NZ households save 40–70% off their power bills with solar. Solar panel costs are offset by long-term savings. The payback period is usually 7–10 years.",
      button: "Calculate Savings"
    }
  }

  const currentContent = content[pageVariant];

  return (
    <motion.section 
      id="savings" 
      className="w-full bg-gradient-to-b from-primary to-orange-400 text-primary-foreground py-12 md:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 text-center md:grid-cols-2 md:px-6 md:text-left lg:gap-12">
        <div className="relative h-64 w-full md:h-80 flex items-center justify-center">
            <Banknote className="h-32 w-32 text-primary-foreground animate-sway" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {currentContent.headline}
          </h2>
          <p className="md:text-lg text-primary-foreground/90">
            {currentContent.description}
          </p>
          <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="#get-quotes">{currentContent.button}</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
