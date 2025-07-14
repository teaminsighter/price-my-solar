import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function Hero() {
  return (
    <section
      id="get-quotes"
      className="relative w-full overflow-hidden bg-gradient-to-br from-cyan-50/50 via-background to-amber-50/50"
    >
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="House with solar panels"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
        data-ai-hint="house solar panel"
      />
      <div className="container relative z-10 mx-auto px-4 py-16 md:px-6 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative hidden h-[500px] w-full lg:block">
            <Image
              src="https://storage.googleapis.com/project-spark-341200.appspot.com/users%2F5gD0P2F33vR1rDfaJbpkMrVpM1v1%2Fuploads%2Fimages%2Fhand-holding-phone.png"
              alt="Hand holding phone with solar quote"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md bg-card/90 p-4 shadow-2xl backdrop-blur-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="bg-primary p-4 text-center text-primary-foreground">
                  <h2 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                    COMPARE
                  </h2>
                  <h2 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                    Solar Quotes
                  </h2>
                </div>
                <div className="w-full bg-slate-100 p-6">
                  <p className="font-semibold text-accent">
                    Installation Costs & Power Savings
                  </p>
                  <h3 className="mb-4 text-2xl font-bold text-secondary">
                    COMPARE & SAVE
                  </h3>
                  <form className="space-y-4">
                    <div className="relative">
                      <Input
                        id="address"
                        placeholder="Start typing your address"
                        className="h-12 w-full text-center text-base"
                      />
                    </div>
                    <p className="text-sm font-semibold text-accent">
                      Once your address shows; <br /> SELECT your installation
                      type
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-none bg-primary text-lg font-bold hover:bg-primary/90"
                    >
                      RESIDENTIAL SOLAR
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      size="lg"
                      className="w-full rounded-none border-accent bg-transparent text-lg font-bold text-accent hover:bg-accent/10"
                    >
                      COMMERCIAL SOLAR
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
