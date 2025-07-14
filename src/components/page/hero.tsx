
'use client';

import Image from 'next/image';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// It's recommended to move the API key to environment variables
const GOOGLE_PLACES_API_KEY = 'AIzaSyCbB2T9z5-peMYY-75oa1kdsJMdAGaKZDo';
const libraries: ('places' | 'geocoding' | 'routes' | 'drawing' | 'visualization' | 'geometry')[] = ['places'];


export function Hero() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_PLACES_API_KEY,
    libraries,
  });

  if (!isLoaded) {
    return (
        <section
        id="get-quotes"
        className="relative w-full overflow-hidden bg-background"
      >
        <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 lg:py-24">
            <div>Loading...</div>
        </div>
      </section>
    );
  }

  return <HeroLoaded />;
}

function HeroLoaded() {
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

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();
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
            className="cursor-pointer p-2 hover:bg-gray-100"
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
       <Image
        src="https://storage.googleapis.com/project-spark-341200.appspot.com/users%2F5gD0P2F33vR1rDfaJbpkMrVpM1v1%2Fuploads%2Fimages%2Fss-bg-layer.png"
        alt="Solar panels background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
      />
      <div className="container relative z-10 mx-auto grid min-h-[600px] grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 lg:py-24">
        <div className="flex flex-col items-start justify-center space-y-6">
            <div className="relative h-40 w-full max-w-sm">
                <Image
                    src="https://storage.googleapis.com/project-spark-341200.appspot.com/users%2F5gD0P2F33vR1rDfaJbpkMrVpM1v1%2Fuploads%2Fimages%2Fss-main-logo.png"
                    alt="Price My Solar NZ Logo"
                    layout="fill"
                    objectFit="contain"
                    className="object-left"
                />
            </div>
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
                  <form className="space-y-4">
                  <div className="relative">
                      <Input
                        id="address"
                        value={value}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder="Start typing your address"
                        className="h-12 w-full text-center text-base"
                        autoComplete="off"
                      />
                      {status === 'OK' && renderSuggestions()}
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
    </section>
  );
}
