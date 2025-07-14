import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function Hero() {
  return (
    <section
      id="get-quotes"
      className="w-full bg-gradient-to-br from-accent/10 via-background to-primary/10 py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              COMPARE SOLAR QUOTES
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Quotes from NZ qualified installers for your home or business.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                100% Free
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No Obligation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                SEANZ Approved Installers
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-start gap-4">
              <Image
                src="https://placehold.co/150x200.png"
                alt="Example solar quote"
                width={150}
                height={200}
                className="hidden rounded-lg shadow-md sm:block"
                data-ai-hint="document contract"
              />
              <Card className="flex-1 bg-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent-foreground">
                    Compare Solar Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-accent-foreground/80">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0" />
                      <span>Receive multiple quotes to find the best deal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0" />
                      <span>We only work with trusted, vetted installers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0" />
                      <span>Save thousands on your installation and energy bills.</span>
                    </li>
                  </ul>
                  <Button
                    variant="secondary"
                    className="w-full rounded-full bg-white text-accent hover:bg-white/90"
                    asChild
                  >
                    <Link href="#costs">Compare & Save</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Enter your address to start"
                      className="h-12 pl-10 text-lg"
                    />
                  </div>
                  <RadioGroup defaultValue="residential" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="residential" id="residential" />
                      <Label htmlFor="residential">Residential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial">Commercial</Label>
                    </div>
                  </RadioGroup>
                  <Button type="submit" size="lg" className="w-full rounded-full text-lg">
                    GET SOLAR QUOTES
                  </Button>
                </form>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  We respect your privacy. No spam, ever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}