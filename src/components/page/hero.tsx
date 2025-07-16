
'use client';

import { useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { QuoteData } from '@/components/quote-funnel';
import { MapPin } from 'lucide-react';

const libraries: ('places')[] = ['places'];

const heroContentConfig = {
  errorLoadingMaps: "Error loading maps. Please check the API key.",
};

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
                <div>{heroContentConfig.errorLoadingMaps}</div>
             </div>
          </section>
        )
    }

    if (!isLoaded) {
        return (
          <section id="get-quotes" className="relative w-full overflow-hidden bg-background">
             <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
             </div>
          </section>
        );
    }

    return <HeroContent onStartFunnel={onStartFunnel} />;
}


function HeroContent({ onStartFunnel }: HeroProps) {
    const [propertyType, setPropertyType] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL');
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

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = (description: string) => {
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
            onClick={() => handleSelect(suggestion.description)}
            className="cursor-pointer p-2 text-left hover:bg-gray-100 text-foreground"
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </div>
        );
      })}
    </div>
  );

  return (
    <section
      id="get-quotes"
      className="relative w-full overflow-hidden bg-background"
    >
      <div className="w-full bg-secondary py-4 text-secondary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-xl font-bold tracking-wider">COMPARE SOLAR QUOTES</h1>
          <p className="text-sm">QUOTES FROM NZ QUALIFIED INSTALLERS</p>
        </div>
      </div>
      
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="uppercase">COMPARE</span> Solar Quotes
          </h2>
          <p className="text-lg text-muted-foreground">
            Installation Costs & Power Savings
          </p>
          <div className="inline-block rounded-md bg-accent px-6 py-3 text-lg font-bold text-accent-foreground">
            COMPARE & SAVE
          </div>
        </div>

        <div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={propertyType === 'RESIDENTIAL' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('RESIDENTIAL')}
                  >
                    RESIDENTIAL SOLAR
                  </Button>
                  <Button
                    type="button"
                    variant={propertyType === 'COMMERCIAL' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('COMMERCIAL')}
                  >
                    COMMERCIAL SOLAR
                  </Button>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/80" />
                  <Input
                    id="address"
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Start typing your address"
                    className="h-12 w-full bg-primary pl-10 text-base text-primary-foreground placeholder:text-primary-foreground/80 focus-visible:ring-primary/80"
                    autoComplete="off"
                  />
                  {status === 'OK' && renderSuggestions()}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Once your address shows; SELECT your installation type
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
