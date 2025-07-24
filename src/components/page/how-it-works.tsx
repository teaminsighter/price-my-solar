
"use client"
import { motion } from "framer-motion";
import { AnimatedIconSunlight, AnimatedIconConvert, AnimatedIconPowerHome, AnimatedIconSavings } from "@/components/icons";
import { cn } from "@/lib/utils";

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

const Step = ({ step, index }: { step: typeof steps[0], index: number }) => {
  const isEven = index % 2 === 0;
  
  const content = (
    <div className={cn(
      "w-full md:w-5/12", 
      isEven ? "md:text-right" : "md:text-left"
    )}>
      <h3 className="text-xl font-bold">{step.title}</h3>
      <p className="mt-2 text-muted-foreground">{step.description}</p>
    </div>
  );

  const icon = (
    <div className="flex w-full items-center justify-center md:w-5/12">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md">
        <step.icon className="h-12 w-12 text-primary" />
      </div>
    </div>
  );

  return (
    <motion.div
      className="flex w-full flex-col items-center justify-between gap-8 md:flex-row"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      {isEven ? <>{content}{icon}</> : <>{icon}{content}</>}
    </motion.div>
  );
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-background py-12 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How Solar Works
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            A simple, transparent process from sun to socket.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-primary/30 md:block"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-center justify-center">
                {/* Timeline Point */}
                <div className="absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background md:block"></div>
                
                {/* Mobile line and point */}
                <div className="absolute left-4 top-0 h-full w-0.5 -translate-x-1/2 bg-primary/30 md:hidden"></div>
                <div className="absolute left-4 top-12 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background md:hidden"></div>

                {/* Content */}
                <div className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-0">
                   <div className={cn(
                      "w-full md:w-5/12 flex", 
                      index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                   )}>
                      {index % 2 === 0 ? (
                        // Text on the left, icon on the right for desktop
                        <div className="w-full pl-12 md:pl-0 md:pr-12 md:text-right">
                           <h3 className="text-xl font-bold">{step.title}</h3>
                           <p className="mt-2 text-muted-foreground">{step.description}</p>
                        </div>
                      ) : (
                        // Icon on the left
                        <div className="w-full flex justify-center md:justify-start">
                           <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md">
                             <step.icon className="h-12 w-12 text-primary" />
                           </div>
                        </div>
                      )}
                   </div>

                   {/* Middle number circle for desktop */}
                   <div className="order-first md:order-none z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-lg md:mx-8">
                       {index + 1}
                   </div>
                   
                   <div className={cn(
                      "w-full md:w-5/12 flex",
                      index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                   )}>
                     {index % 2 === 0 ? (
                        // Icon on the right
                        <div className="w-full flex justify-center md:justify-start">
                           <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md">
                             <step.icon className="h-12 w-12 text-primary" />
                           </div>
                        </div>
                      ) : (
                         // Text on the right
                         <div className="w-full pl-12 md:pl-12 md:text-left">
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="mt-2 text-muted-foreground">{step.description}</p>
                         </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
