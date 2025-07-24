"use client"
import { motion, useScroll, useSpring } from "framer-motion";
import { AnimatedIconSunlight, AnimatedIconConvert, AnimatedIconPowerHome, AnimatedIconSavings } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useRef } from "react";

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

type HowItWorksProps = {
  pageVariant: 'Quote' | 'Cost';
};


export function HowItWorks({ pageVariant }: HowItWorksProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={ref} id="how-it-works" className="w-full bg-background py-12 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-20">
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How Solar Works
          </motion.h2>
          <motion.p 
            className="mt-4 text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A simple, transparent process from sun to socket.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Lines */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />
          <motion.div
            className="absolute left-1/2 top-0 hidden h-full w-0.5 origin-top -translate-x-1/2 bg-primary"
            style={{ scaleY }}
            aria-hidden="true"
          />
          <div className="absolute left-4 top-0 h-full w-0.5 -translate-x-1/2 bg-border md:hidden" />
           <motion.div
            className="absolute left-4 top-0 h-full w-0.5 origin-top -translate-x-1/2 bg-primary md:hidden"
            style={{ scaleY }}
            aria-hidden="true"
          />

          <div className="space-y-16">
            {steps.map((step, index) => {
               const isEven = index % 2 === 0;

               const content = (
                <motion.div
                  className={cn("w-full md:w-5/12 pl-12 md:pl-0", isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left")}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </motion.div>
              );

              const icon = (
                <motion.div
                  className="w-full flex md:w-5/12"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                   <div className={cn("relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md",
                      isEven ? "md:ml-auto" : "md:mr-auto", "ml-auto mr-auto"
                   )}>
                     <step.icon className="h-12 w-12 text-primary" />
                   </div>
                </motion.div>
              );

              return (
                <div key={index} className="relative flex flex-col-reverse md:flex-row items-center justify-center">
                   <div className="absolute left-4 top-11 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-1/2 md:top-1/2 md:-translate-y-1/2" />
                  
                  <div className="flex w-full flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-0">
                    {isEven ? <>{content}{icon}</> : <>{icon}{content}</>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
