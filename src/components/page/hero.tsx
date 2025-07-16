
'use client';

import { useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { QuoteData } from '@/components/quote-funnel';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

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
             <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-start justify-center">
                <div>{heroContentConfig.errorLoadingMaps}</div>
             </div>
          </section>
        )
    }

    if (!isLoaded) {
        return (
          <section id="get-quotes" className="relative w-full overflow-hidden bg-background">
             <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-start justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
             </div>
          </section>
        );
    }

    return <HeroContent onStartFunnel={onStartFunnel} />;
}


function HeroContent({ onStartFunnel }: HeroProps) {
    const [propertyType, setPropertyType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | null>(null);

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
        if (propertyType) {
            onStartFunnel({ address: description, propertyType });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value && propertyType) {
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
      <div className="container mx-auto grid min-h-[60vh] grid-cols-1 items-start gap-8 px-4 py-8 pt-12 md:grid-cols-2 lg:px-6">
        <div className="space-y-8 text-left">
          <h1 className="text-6xl font-bold uppercase text-foreground">
            Compare Solar<br/>Quotes
          </h1>
          
          <div className="space-y-6 rounded-lg border border-border/50 bg-card p-8 shadow-sm">
             <p className="text-xl text-muted-foreground">Installation costs &amp; power savings</p>
             <p className="text-2xl font-bold text-foreground">Compare &amp; save</p>
             <div className="grid grid-cols-2 gap-4">
                <Button 
                    variant={propertyType === 'RESIDENTIAL' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('RESIDENTIAL')}
                    className="font-bold h-10 px-4 text-sm"
                >
                    Residential
                </Button>
                <Button
                    variant={propertyType === 'COMMERCIAL' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('COMMERCIAL')}
                    className="font-bold h-10 px-4 text-sm"
                >
                    Commercial
                </Button>
             </div>
             <form onSubmit={handleSubmit} className="relative mt-4">
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/80 z-10" />
                    <Input
                        id="address"
                        value={value}
                        onChange={handleInput}
                        disabled={!ready || !propertyType}
                        className="h-12 w-full pl-10 text-base bg-primary text-primary-foreground placeholder:text-primary-foreground/80 disabled:opacity-70"
                        autoComplete="off"
                    />
                    {value === '' && (
                        <label htmlFor="address" className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none text-base font-bold text-primary-foreground/80">
                           Start typing your address
                        </label>
                    )}
                    {status === 'OK' && renderSuggestions()}
                </div>
            </form>
          </div>
        </div>
        <div className="hidden h-full items-end justify-center md:flex">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FResidential-phone-v2.webp?alt=media&token=60ea4ab3-1aa5-4310-bd8a-116e68dd6386"
            alt="Phone showing solar quotes"
            width={400}
            height={800}
            className="h-auto w-full max-w-sm object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
