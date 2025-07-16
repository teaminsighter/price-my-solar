import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Home, Users, Building2 } from "lucide-react";

const costTiers = [
  {
    title: "Couple",
    price: "Less than $12,000",
    features: ["Low solar needs", "Minimal battery/storage", "Best for small homes"],
    icon: null, // Will be replaced by an image
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FTiers%2Fcouple.jpg?alt=media&token=3b2d1fb2-321f-4e40-adfa-421de8060497",
    imageHint: "couple house"
  },
  {
    title: "Family",
    price: "$12,000 – $17,000",
    features: ["Can export/store power", "Good ROI, more energy usage"],
    icon: Users,
    imageUrl: null,
  },
  {
    title: "Large Family",
    price: "$17,000 – $22,000",
    features: ["Large property", "Higher consumption & battery"],
    icon: Building2,
    imageUrl: null,
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
            <Card key={tier.title} className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-muted/50">
                   {tier.imageUrl ? (
                    <Image
                      src={tier.imageUrl}
                      alt={tier.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform group-hover:scale-110"
                      data-ai-hint={tier.imageHint}
                    />
                  ) : tier.icon ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <tier.icon className="h-24 w-24 text-primary transition-transform group-hover:scale-110" />
                    </div>
                  ) : null}
                </div>
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
            <Link href="#get-quotes">Compare Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
