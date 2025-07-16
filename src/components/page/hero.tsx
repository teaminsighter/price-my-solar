
'use client';

import { useState, useEffect } from 'react';
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
  onStartFunnel: (data: Omit<QuoteData, 'userId'>) => void;
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
             <div className="container relative z-10 mx-auto grid min-h-[60vh] items-center justify-center text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
             </div>
          </section>
        );
    }

    return <HeroContent onStartFunnel={onStartFunnel} />;
}

const demoAddresses = [
  "123 Queen Street, Auckland",
  "789 Lambton Quay, Wellington",
  "45 Colombo Street, Christchurch",
];

function HeroContent({ onStartFunnel }: HeroProps) {
    const [propertyType, setPropertyType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | null>(null);
    const [placeholder, setPlaceholder] = useState('Start typing your address');

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

    useEffect(() => {
      let typingTimeout: NodeJS.Timeout;
      
      const type = (text: string, index = 0) => {
        if (index < text.length) {
          setPlaceholder(text.substring(0, index + 1));
          typingTimeout = setTimeout(() => type(text, index + 1), 100);
        } else {
          typingTimeout = setTimeout(deleteText, 2000); // Wait before deleting
        }
      };

      const deleteText = (text = placeholder, index = text.length) => {
        if (index > 0) {
          setPlaceholder(text.substring(0, index - 1));
          typingTimeout = setTimeout(() => deleteText(text, index - 1), 50);
        } else {
           const nextAddressIndex = (demoAddresses.indexOf(text) + 1) % demoAddresses.length;
           typingTimeout = setTimeout(() => type(demoAddresses[nextAddressIndex]), 500);
        }
      };

      // Start the animation
      typingTimeout = setTimeout(() => {
          deleteText('Start typing your address');
      }, 3000);

      return () => clearTimeout(typingTimeout);
    // We only want this to run once on mount, so we disable the exhaustive-deps lint rule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
      <div className="container relative z-10 mx-auto grid min-h-[60vh] grid-cols-1 items-start gap-8 px-4 py-8 pt-12 md:grid-cols-2 lg:px-6">
        <div className="relative space-y-6 text-left">
          <h1 className="text-4xl font-bold uppercase text-foreground sm:text-6xl">
            Compare Solar<br/>Quotes
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Compare two quotes from New Zealand’s top solar installers side by side and see how much you could save—choose the best deal and maximize your power savings.
          </p>
          
          <div className="space-y-6 rounded-lg border border-border/50 bg-card p-8 shadow-sm">
             <div className="grid grid-cols-2 gap-4">
                <Button 
                    variant={propertyType === 'RESIDENTIAL' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('RESIDENTIAL')}
                    className="h-10 px-4 text-sm font-bold"
                >
                    Residential
                </Button>
                <Button
                    variant={propertyType === 'COMMERCIAL' ? 'default' : 'outline'}
                    onClick={() => setPropertyType('COMMERCIAL')}
                    className="h-10 px-4 text-sm font-bold"
                >
                    Commercial
                </Button>
             </div>
             <form onSubmit={handleSubmit} className="relative mt-4">
                <div className="relative flex items-center">
                    <MapPin className="absolute left-3 z-10 h-5 w-5 text-primary-foreground/80" />
                    <Input
                        id="address"
                        value={value}
                        onChange={handleInput}
                        disabled={!ready || !propertyType}
                        placeholder={placeholder}
                        className="h-12 w-full bg-primary pl-10 text-base text-primary-foreground placeholder:text-primary-foreground/80 disabled:opacity-70"
                        autoComplete="off"
                    />
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
