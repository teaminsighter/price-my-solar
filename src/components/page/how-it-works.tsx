
"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedIconSunlight, AnimatedIconConvert, AnimatedIconPowerHome, AnimatedIconSavings } from "@/components/icons";

const steps = [
  {
    icon: AnimatedIconSunlight,
    title: "Step 1: Capture Sunlight",
    description: "Solar panels on your roof capture sunlight, converting it into DC (Direct Current) electricity.",
  },
  {
    icon: AnimatedIconConvert,
    title: "Step 2: Convert to Usable Power",
    description: "An inverter converts the DC electricity into AC (Alternating Current) electricity, which is what your home uses.",
  },
  {
    icon: AnimatedIconPowerHome,
    title: "Step 3: Power Your Home",
    description: "Extra power can charge a home battery for later use or be sent back to the grid, earning you credits.",
  },
  {
    icon: AnimatedIconSavings,
    title: "Step 4: Use Your Power",
    description: "You'll always use your own solar power first, which means buying less from your energy retailer and saving money.",
  },
];

export function HowItWorks() {
  return (
    <motion.section 
      id="how-it-works" 
      className="w-full bg-card py-12 md:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
           <p className="text-xs text-muted-foreground/80">More info – <Link href="#" className="underline">Vivint Solar</Link></p>
          <Button size="lg" asChild>
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
        <div className="relative flex h-96 w-full items-center justify-center">
            <div className="absolute left-20 top-10 h-12 w-12 animate-float rounded-full bg-accent/20 animation-delay-500"></div>
            <div className="absolute bottom-16 right-16 h-20 w-20 animate-float rounded-full bg-primary/20 animation-delay-1500"></div>
            <Settings className="h-32 w-32 animate-spin-slow text-primary" />
        </div>
      </div>
    </motion.section>
  );
}
