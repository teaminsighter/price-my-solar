import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const costTiers = [
  {
    title: "Couple",
    price: "Less than $12,000",
    features: ["Low solar needs", "Minimal battery/storage", "Best for small homes"],
    image: {
      src: "https://placehold.co/400x300.png",
      hint: "small house",
    },
  },
  {
    title: "Family",
    price: "$12,000 – $17,000",
    features: ["Can export/store power", "Good ROI, more energy usage"],
    image: {
      src: "https://placehold.co/400x300.png",
      hint: "family house solar",
    },
  },
  {
    title: "Large Family",
    price: "$17,000 – $22,000",
    features: ["Large property", "Higher consumption & battery"],
    image: {
      src: "https://placehold.co/400x300.png",
      hint: "large house solar",
    },
  },
];

export function ApproxCosts() {
  return (
    <section id="estimates" className="w-full bg-background py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Approximate Solar Installation Costs
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Most NZ solar installs fit within these cost bands. Request a custom quote for your address.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {costTiers.map((tier) => (
            <Card key={tier.title} className="flex flex-col overflow-hidden shadow-lg transition-transform hover:scale-105">
              <CardHeader className="p-0">
                <Image
                  src={tier.image.src}
                  alt={tier.title}
                  width={400}
                  height={300}
                  className="h-48 w-full object-cover"
                  data-ai-hint={tier.image.hint}
                />
                <CardTitle className="p-6">{tier.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between p-6 pt-0">
                <div>
                  <ul className="mb-6 space-y-2 text-muted-foreground">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-3xl font-bold">{tier.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-full" asChild>
            <Link href="#get-quotes">Compare Two Quotes Online</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
