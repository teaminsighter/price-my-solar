
"use client"

import { motion } from "framer-motion"
import { GitCompareArrows, BadgePercent, ClipboardList, PiggyBank, Handshake, FileQuestion, CalendarDays, MailQuestion } from "lucide-react"

const faqItems = [
  {
    question: "Why should I compare solar quotes instead of choosing the first one?",
    answer: "Comparing solar quotes helps you get the best deal. Prices, warranties, equipment quality, and installation standards vary widely. By comparing at least two quotes, you ensure you're getting competitive pricing and quality service, potentially saving thousands of dollars.",
    icon: GitCompareArrows,
  },
  {
    question: "Is comparing solar quotes really free?",
    answer: "Absolutely! Our Compare Solar Quotes service is 100% free, with no hidden charges or obligations. We simply help you compare two customized offers from trusted, qualified installers. You’re free to choose one—or none at all.",
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

const flipVariants = {
  initial: { rotateY: 0 },
  hover: { rotateY: 180 },
};

export default function FaqSection() {
  return (
    <section id="faq" className="w-full bg-card py-12 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Hover over a card to find answers to common questions.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              className="relative h-64 w-full [perspective:1000px]"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                variants={flipVariants}
                initial="initial"
                whileHover="hover"
                transition={{ duration: 0.6 }}
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
          ))}
        </div>
      </div>
    </section>
  )
}
