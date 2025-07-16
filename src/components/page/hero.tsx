
'use client';

import Image from 'next/image';
import { useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { QuoteData } from '@/components/quote-funnel';
import { Check } from 'lucide-react';

const libraries: ('places')[] = ['places'];

// Configuration for all text content in the Hero component
const heroContentConfig = {
  bullet1: "SEANZ-member installers",
  bullet2: "100% Free with no obligation",
  addressPlaceholder: "Start typing your address...",
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

    const handleSelect = ({ description }: { description: string }) => () => {
        setValue(description, false);
        clearSuggestions();
        onStartFunnel({ address: description, propertyType: 'RESIDENTIAL' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value) {
            onStartFunnel({ address: value, propertyType: 'RESIDENTIAL' });
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

  return (
    <section
      id="get-quotes"
      className="relative w-full overflow-hidden bg-background"
    >
      <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 lg:pl-16 lg:pr-8 lg:py-20">
        <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Compare Solar Quotes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Quotes from NZ qualified installers
                </p>
            </div>
            <ul className="space-y-2">
                <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{heroContentConfig.bullet1}</span>
                </li>
                <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{heroContentConfig.bullet2}</span>
                </li>
            </ul>
            <form className="relative flex max-w-md space-x-2" onSubmit={handleSubmit}>
              <div className="relative flex-grow">
                <Input
                  id="address"
                  value={value}
                  onChange={handleInput}
                  disabled={!ready}
                  placeholder={heroContentConfig.addressPlaceholder}
                  className="h-12 w-full text-base border-primary focus:ring-primary focus:border-primary"
                  autoComplete="off"
                />
                {status === 'OK' && renderSuggestions()}
              </div>
            </form>
        </div>
        <div className="flex justify-end items-end h-[500px]">
            <div className="relative h-full w-[250px]">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FResidential-phone-v2.webp?alt=media&token=60ea4ab3-1aa5-4310-bd8a-116e68dd6386"
                  alt="Phone showing solar quote interface"
                  fill
                  className="object-contain"
                />
            </div>
        </div>
      </div>
    </section>
  );
}
