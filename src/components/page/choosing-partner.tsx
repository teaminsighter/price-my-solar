
"use client"
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function ChoosingPartner() {
  return (
    <motion.section 
      id="partner" 
      className="w-full bg-background py-12 md:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
        <div className="relative h-80 w-full flex items-center justify-center">
            <div className="absolute top-10 left-20 h-16 w-16 bg-primary/20 rounded-full animate-float"></div>
            <div className="absolute bottom-10 right-20 h-24 w-24 bg-accent/20 rounded-full animate-float animation-delay-1000"></div>
            <Wrench className="h-32 w-32 text-primary animate-wobble" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choosing the Right Partner
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Look for SEANZ-member installers with strong track records, clear case studies, and compliance with NZ standards. The cheapest quote isn’t always the best. Ask for evidence of previous installs and check Google reviews.
          </p>
          <Button size="lg" asChild>
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
