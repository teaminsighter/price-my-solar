
'use client';

import Image from 'next/image';
import { useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { QuoteData } from '@/components/quote-funnel';
import { cn } from '@/lib/utils';

const libraries: ('places')[] = ['places'];

type HeroProps = {
  onStartFunnel: (data: QuoteData) => void;
};

export function Hero({ onStartFunnel }: HeroProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
        libraries,
    });

    if (loadError) {
        return (
             <section id="get-quotes" className="relative w-full overflow-hidden bg-background">
             <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center justify-center">
                <div>Error loading maps. Please check the API key.</div>
             </div>
          </section>
        )
    }

    if (!isLoaded) {
        return (
          <section id="get-quotes" className="relative w-full overflow-hidden bg-background">
             <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center justify-center">
                <div>Loading...</div>
             </div>
          </section>
        );
    }

    return <HeroContent onStartFunnel={onStartFunnel} />;
}


function HeroContent({ onStartFunnel }: HeroProps) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: 'nz' },
        },
        debounce: 300,
    });

    const [propertyType, setPropertyType] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL');

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = ({ description }: { description: string }) => () => {
        setValue(description, false);
        clearSuggestions();
        onStartFunnel({ address: description, propertyType });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value) {
            onStartFunnel({ address: value, propertyType });
        }
    };


  const renderSuggestions = () => (
    <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
      {data.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return (
          <div
            key={place_id}
            onClick={handleSelect(suggestion)}
            className="cursor-pointer p-2 text-left hover:bg-gray-100"
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </div>
        );
      })}
    </div>
  );

  const buttonBaseClass = "flex w-full cursor-pointer items-center justify-center rounded-md border p-3 font-medium transition-colors";
  const unselectedClass = "text-muted-foreground bg-background hover:bg-muted/50";
  const selectedClass = "border-primary bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <section
      id="get-quotes"
      className="relative w-full overflow-hidden bg-background"
    >
       <Image
        src="https://storage.googleapis.com/project-spark-341200.appspot.com/users%2F5gD0P2F33vR1rDfaJbpkMrVpM1v1%2Fuploads%2Fimages%2Fss-bg-layer.png"
        alt="Solar panels background"
        fill
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
      />
      <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 lg:py-24">
        <div className="flex flex-col items-start justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter text-secondary sm:text-5xl md:text-6xl">
              PRICE MY SOLAR
              <span className="block text-xl font-normal text-muted-foreground">Save Power & Compare Solar</span>
            </h1>
            <p className="max-w-md text-lg text-foreground/80 md:text-xl">
                Quotes from NZ qualified installers for your home or business. <br/>
                <strong>100% Free, No Obligation, SEANZ Approved.</strong>
            </p>
            <div className="relative h-20 w-full max-w-xs">
                 <Image
                    src="https://storage.googleapis.com/project-spark-341200.appspot.com/users%2F5gD0P2F33vR1rDfaJbpkMrVpM1v1%2Fuploads%2Fimages%2Fss-left-logo.png"
                    alt="Sustainable Energy Association New Zealand Member"
                    layout="fill"
                    objectFit="contain"
                    className="object-left"
                />
            </div>
        </div>
        <div className="flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/90 p-4 shadow-2xl backdrop-blur-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="w-full bg-slate-100 p-6">
                   <p className="font-semibold text-accent">
                    Installation Costs & Power Savings
                  </p>
                  <h3 className="mb-4 text-2xl font-bold text-secondary">
                    COMPARE & SAVE
                  </h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    <RadioGroup 
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value: 'RESIDENTIAL' | 'COMMERCIAL') => setPropertyType(value)}
                      value={propertyType}
                    >
                      <div>
                        <RadioGroupItem value="RESIDENTIAL" id="r1" className="sr-only" />
                        <Label
                          htmlFor="r1"
                          className={cn(buttonBaseClass, propertyType === 'RESIDENTIAL' ? selectedClass : unselectedClass)}
                        >
                          Residential
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="COMMERCIAL" id="r2" className="sr-only" />
                        <Label
                          htmlFor="r2"
                           className={cn(buttonBaseClass, propertyType === 'COMMERCIAL' ? selectedClass : unselectedClass)}
                        >
                          Commercial
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="relative">
                      <Input
                        id="address"
                        value={value}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder="Start typing your address..."
                        className="h-12 w-full text-center text-base"
                        autoComplete="off"
                      />
                      {status === 'OK' && renderSuggestions()}
                    </div>
                     
                    <Button type="submit" size="lg" className="w-full" disabled={!value}>
                        Get My Free Quote
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
