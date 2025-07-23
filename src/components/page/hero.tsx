
'use client';

import { useState, useEffect } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { QuoteData } from '@/components/quote-funnel';
import { Check, MapPin } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const libraries: ('places')[] = ['places'];

const heroContentConfig = {
  errorLoadingMaps: "Error loading maps. Please check the API key.",
};

type HeroProps = {
  onStartFunnel: (data: Omit<QuoteData, 'userId'>) => void;
  pageVariant: 'Quote' | 'Cost';
};

export function Hero({ onStartFunnel, pageVariant }: HeroProps) {
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

    return <HeroContent onStartFunnel={onStartFunnel} pageVariant={pageVariant} />;
}

const demoAddresses = [
  "123 Queen Street, Auckland",
  "789 Lambton Quay, Wellington",
  "45 Colombo Street, Christchurch",
];

function HeroContent({ onStartFunnel, pageVariant }: HeroProps) {
    const [address, setAddress] = useState<string>('');
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
        cache: 86400, // Cache suggestions for a day
        defaultValue: address
    });

    useEffect(() => {
        if (address) {
            onStartFunnel({ address, propertyType: 'RESIDENTIAL' });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);
    
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
        setAddress(description);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value) {
            setAddress(value);
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
  
  const content = {
    Quote: {
      headline: <>Compare Solar<br/>Quotes</>,
      description: "Compare two quotes from New Zealand’s top solar installers side by side and see how much you could save—choose the best deal and maximise your power savings.",
      cta: "Where do you want to install solar?",
      check1: "New Zealand's No.1 Solar Comparison Site",
      check2: "Only vetted, SEANZ-registered solar companies."
    },
    Cost: {
      headline: <>Solar Panel<br/>Cost NZ</>,
      description: "Find out the cost of solar panels for your home. Get two independent cost estimates from NZ's top solar companies and see how much you could save.",
      cta: "Where do you want to calculate solar costs?",
      check1: "New Zealand's No.1 Solar Cost Calculator",
      check2: "Only vetted, SEANZ-registered solar companies."
    }
  }

  const currentContent = content[pageVariant];

  return (
    <section
      id="get-quotes"
      className="relative w-full overflow-hidden bg-gradient-to-r from-primary to-orange-400 bg-[length:200%_200%] animate-hero-gradient"
    >
      <div className="container relative z-10 mx-auto grid min-h-[60vh] grid-cols-1 items-start gap-8 px-4 py-8 pt-12 md:grid-cols-2 lg:px-6">
        <div className="flex flex-col justify-center">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FResidential-phone-v2.webp?alt=media&token=60ea4ab3-1aa5-4310-bd8a-116e68dd6386"
            alt="Phone showing solar quotes"
            width={450}
            height={600}
            className="w-full max-w-sm object-contain -translate-y-4 md:translate-y-0"
            priority
            data-ai-hint="phone screen"
          />
        </div>
        <div className="relative space-y-6 text-left md:pt-8">
          <h1 className="text-5xl font-black uppercase text-primary-foreground drop-shadow-md sm:text-6xl md:text-7xl">
            {currentContent.headline}
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-xl">
            {currentContent.description}
          </p>
          
          <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6 shadow-sm">
              <motion.div 
                className="min-h-[2.5rem] flex items-center justify-start transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-left text-lg md:text-xl font-bold text-foreground">
                    {currentContent.cta}
                </p>
              </motion.div>
             <form onSubmit={handleSubmit} className="relative w-full">
                <div className="relative flex items-center w-full">
                    <MapPin className="absolute left-3 h-5 w-5 text-primary" />
                    <Input
                        id="address"
                        value={value}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder={placeholder}
                        className="h-12 w-full bg-background pl-10 text-base font-bold text-foreground placeholder:text-muted-foreground/90 disabled:opacity-70"
                        autoComplete="off"
                    />
                    {status === 'OK' && renderSuggestions()}
                </div>
            </form>
            <ul className="space-y-2 pt-4">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{currentContent.check1}</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{currentContent.check2}</span>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
