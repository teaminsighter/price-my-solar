
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqItems = [
  {
    question: "Why should I compare solar quotes instead of choosing the first one?",
    answer: "Comparing solar quotes helps you get the best deal. Prices, warranties, equipment quality, and installation standards vary widely. By comparing at least two quotes, you ensure you're getting competitive pricing and quality service, potentially saving thousands of dollars.",
  },
  {
    question: "Is comparing solar quotes really free?",
    answer: "Absolutely! Our Compare Solar Quotes service is 100% free, with no hidden charges or obligations. We simply help you compare two customized offers from trusted, qualified installers. You’re free to choose one—or none at all.",
  },
  {
    question: "What exactly will my solar quotes include?",
    answer: "Your quotes clearly outline:\n\n- Total installation costs\n- Number and brand of solar panels, batteries and inverter\n- Estimated annual energy production and savings\n- Warranty details and length\n- Financing or payment plan options (if applicable)\n\nEverything is explained in simple, straightforward terms.",
  },
  {
    question: "How much can I actually save by comparing quotes?",
    answer: "Customers who compare two or more quotes typically save 10–20% or more compared to accepting the first offer. On a standard $10,000 installation, you could save $1,000–$2,000 or even more simply by comparing first.",
  },
  {
    question: "Can comparing solar quotes help me negotiate a better price?",
    answer: "Yes! Installers tend to provide their best pricing when they know you're comparing multiple quotes. You can also use competing offers to negotiate better prices or upgrades directly.",
  },
  {
    question: "Am I obligated to choose one of the quotes provided?",
    answer: "Not at all. Once you Compare Solar Quotes, there's no pressure or obligation to select either. Choose the one you like best, or none at all—you're in complete control.",
  },
  {
    question: "If I decide to choose a quote, how soon can the solar installation begin?",
    answer: "Once you select your preferred installer, most projects begin installation within 2–4 weeks, depending on installer availability, weather, and equipment stock. Your installer will give you a clear schedule once confirmed.",
  },
  {
    question: "What if I have more questions after comparing solar quotes?",
    answer: "We’re always here to help! After you receive your two solar quotes, you can contact us anytime to clarify questions or get additional advice. Our goal is making sure you feel confident in your solar decision.",
  },
];

const faqVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function FaqSection() {
  return (
    <section id="faq" className="w-full bg-card py-12 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Find answers to common questions about comparing solar quotes.
          </p>
        </div>
        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={faqVariants}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground whitespace-pre-line">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
