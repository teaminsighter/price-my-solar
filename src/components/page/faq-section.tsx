
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GitCompareArrows, BadgePercent, ClipboardList, PiggyBank, Handshake, FileQuestion, CalendarDays, MailQuestion } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


const faqItemsQuote = [
  {
    question: "Why should I compare solar quotes instead of choosing the first one?",
    answer: "Comparing solar quotes helps you get the best deal. Prices, warranties, equipment quality, and installation standards vary widely. By comparing at least two quotes, you ensure you're getting competitive pricing and quality service, potentially saving thousands of dollars.",
    icon: GitCompareArrows,
  },
  {
    question: "Is comparing solar quotes really free?",
    answer: "Absolutely! Our Compare Solar Quotes service is 100% free, with no hidden charges or obligations. We simply help you compare two customised offers from trusted, qualified installers. You’re free to choose one—or none at all.",
    icon: BadgePercent,
  },
  {
    question: "What exactly will my solar quotes include?",
    answer: "Your quotes clearly outline total installation costs, panel and inverter brands, estimated energy production, warranty details, and any financing options, all in simple terms.",
    icon: ClipboardList,
  },
  {
    question: "How much can I actually save by comparing quotes?",
    answer: "Customers who compare two or more quotes typically save 10–20% or more compared to accepting the first offer. On a standard $10,000 installation, you could save $1,000–$2,000 or even more simply by comparing first.",
    icon: PiggyBank,
  },
  {
    question: "Can comparing solar quotes help me negotiate a better price?",
    answer: "Yes! Installers tend to provide their best pricing when they know you're comparing multiple quotes. You can also use competing offers to negotiate better prices or upgrades directly.",
    icon: Handshake,
  },
  {
    question: "Am I obligated to choose one of the quotes provided?",
    answer: "Not at all. Once you Compare Solar Quotes, there's no pressure or obligation to select either. Choose the one you like best, or none at all—you're in complete control.",
    icon: FileQuestion,
  },
  {
    question: "If I decide to choose a quote, how soon can the solar installation begin?",
    answer: "Once you select your preferred installer, most projects begin installation within 2–4 weeks, depending on installer availability, weather, and equipment stock. Your installer will give you a clear schedule once confirmed.",
    icon: CalendarDays,
  },
  {
    question: "What if I have more questions after comparing solar quotes?",
    answer: "We’re always here to help! After you receive your two solar quotes, you can contact us anytime to clarify questions or get additional advice. Our goal is making sure you feel confident in your solar decision.",
    icon: MailQuestion,
  },
];

const faqItemsCost = [
  {
    question: "How is the cost of solar panels calculated?",
    answer: "The cost is based on system size (kW), panel quality, inverter type, battery storage, and installation complexity. Our tool gives you two detailed cost estimates based on these factors.",
    icon: GitCompareArrows,
  },
  {
    question: "Is calculating my solar cost really free?",
    answer: "Yes, our solar cost calculator is 100% free and without obligation. It provides two independent cost estimates to help you understand your potential investment.",
    icon: BadgePercent,
  },
  {
    question: "What will my solar cost estimates include?",
    answer: "Each estimate details the total cost, including panels, inverters, and installation. It also shows potential savings and the expected return on investment.",
    icon: ClipboardList,
  },
  {
    question: "How accurate are the solar cost estimates?",
    answer: "Our estimates are highly accurate, based on data from top NZ installers. However, a final, precise cost requires a detailed on-site assessment from an installer.",
    icon: PiggyBank,
  },
  {
    question: "Does the solar cost include a battery?",
    answer: "The initial cost estimate is typically for a grid-tied system. You can request options that include the additional cost of a solar battery for energy storage.",
    icon: Handshake,
  },
  {
    question: "Am I obligated to accept a solar cost estimate?",
    answer: "No. The cost estimates are for your information only. There is no obligation to proceed with an installation. You are in complete control.",
    icon: FileQuestion,
  },
  {
    question: "How long is a solar cost estimate valid for?",
    answer: "Solar panel costs and component availability can change. Estimates are generally valid for 30 days, but your chosen installer will confirm the final price.",
    icon: CalendarDays,
  },
  {
    question: "What if I have questions about my cost estimate?",
    answer: "We are here to help. If you have any questions about your solar cost estimate, feel free to contact us for clarification and impartial advice.",
    icon: MailQuestion,
  },
];


const cardVariants = {
  hidden: { opacity: 0, y: 50 },
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

function FaqCard({ item, index }: { item: typeof faqItemsQuote[0], index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative h-64 w-full [perspective:1000px]"
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front of the card */}
        <div className="absolute flex h-full w-full flex-col items-center justify-center rounded-lg border bg-background p-6 text-center [backface-visibility:hidden]">
          <item.icon className="mb-4 h-10 w-10 text-primary" />
          <h3 className="text-md font-semibold">{item.question}</h3>
        </div>
        
        {/* Back of the card */}
        <div className="absolute flex h-full w-full items-center justify-center rounded-lg border bg-primary p-6 text-center text-primary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm">{item.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

type FaqSectionProps = {
  pageVariant: 'Quote' | 'Cost';
};

export default function FaqSection({ pageVariant }: FaqSectionProps) {
  const isMobile = useIsMobile();
  const faqItems = pageVariant === 'Cost' ? faqItemsCost : faqItemsQuote;
  
  return (
    <section id="faq" className="w-full bg-card py-12 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            {isMobile ? "Tap a question to see the answer." : "Hover over a card to find answers to common questions."}
          </p>
        </div>
        
        {isMobile ? (
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <span className="flex items-center text-left">
                      <item.icon className="mr-4 h-6 w-6 text-primary flex-shrink-0" />
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-12">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {faqItems.map((item, index) => (
              <FaqCard key={index} item={item} index={index} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
