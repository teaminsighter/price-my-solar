
"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedIconROI } from "@/components/icons";

type RoiSectionProps = {
  pageVariant: 'Quote' | 'Cost';
};

export function RoiSection({ pageVariant }: RoiSectionProps) {

  const content = {
    Quote: {
      headline: "Return on Investment (ROI)",
      description: "A typical NZ solar system pays for itself in around 7–8 years, while the panels and inverters often last 25 years or more. Solar is a long-term investment in free power, not just a one-time cost.",
      button: "Compare Now",
      link: "Get a tailored ROI estimate for your address."
    },
    Cost: {
      headline: "Return on Investment (ROI)",
      description: "A typical NZ solar system pays for itself in around 7–8 years. The initial solar panel cost is offset by decades of free power, making it a smart long-term investment.",
      button: "Calculate ROI",
      link: "Get a tailored ROI estimate for your address."
    }
  }

  const currentContent = content[pageVariant];

  if (!currentContent) {
    return null;
  }

  return (
    <motion.section 
      id="roi" 
      className="w-full bg-card py-12 md:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {currentContent.headline}
          </h2>
          <p className="text-muted-foreground md:text-lg">
            {currentContent.description}
          </p>
          <div className="space-y-4">
            <Button size="lg" asChild>
                <Link href="#get-quotes">{currentContent.button}</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
                <Link href="#get-quotes" className="underline">{currentContent.link}</Link>
            </p>
          </div>
        </div>
        <div className="relative flex h-80 w-full items-center justify-center">
            <div className="absolute left-24 top-12 h-20 w-20 animate-float rounded-full bg-primary/10"></div>
            <div className="absolute bottom-12 right-24 h-14 w-14 animate-float rounded-full bg-accent/10 animation-delay-1000"></div>
            <AnimatedIconROI className="h-48 w-48 text-primary" />
        </div>
      </div>
    </motion.section>
  );
}
