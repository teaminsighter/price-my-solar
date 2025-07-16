
"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BatteryCharging } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedIconHybrid } from "../icons";

export function HybridSystem() {
  return (
    <motion.section 
      id="hybrid" 
      className="w-full bg-gradient-to-b from-primary to-orange-400 py-12 text-primary-foreground md:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
        <div className="relative flex h-80 w-full items-center justify-center">
          <AnimatedIconHybrid className="h-48 w-48 text-primary-foreground" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What is a Hybrid System?
          </h2>
          <p className="text-primary-foreground/80 md:text-lg">
            Hybrid solar systems combine solar panels, battery storage, and grid backup for maximum flexibility. They protect you from rising grid prices and blackouts, offering the best of both worlds for ultimate energy independence.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
