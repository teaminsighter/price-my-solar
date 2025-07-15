
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export type QuoteData = {
  address: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL';
  ownProperty?: 'Yes' | 'No';
  roofType?: 'Iron' | 'Tile' | 'Bitumen' | 'Other';
};

type QuoteFunnelProps = {
  initialData: QuoteData;
  onExit: () => void;
};

const funnelSteps = [
  { id: 'ownProperty', title: 'Do you own the property?' },
  { id: 'roofType', title: 'What type of roof do you have?' },
  // ... more steps will be added here
];

export function QuoteFunnel({ initialData, onExit }: QuoteFunnelProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuoteData>(initialData);

  const totalSteps = funnelSteps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Handle funnel completion
      console.log('Funnel complete:', formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onExit();
    }
  };
  
  const currentStepInfo = funnelSteps[step];

  const renderStepContent = () => {
    switch (currentStepInfo.id) {
      case 'ownProperty':
        return (
          <RadioGroup
            onValueChange={(value: 'Yes' | 'No') => setFormData({ ...formData, ownProperty: value })}
            value={formData.ownProperty}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="Yes" id="ownYes" className="sr-only" />
              <Label htmlFor="ownYes" className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-transparent bg-primary p-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 [&:has([data-state=checked])]:border-ring">
                Yes
              </Label>
            </div>
            <div>
              <RadioGroupItem value="No" id="ownNo" className="sr-only" />
              <Label htmlFor="ownNo" className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-transparent bg-primary p-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 [&:has([data-state=checked])]:border-ring">
                No
              </Label>
            </div>
          </RadioGroup>
        );
      case 'roofType':
        return (
           <RadioGroup
            onValueChange={(value: 'Iron' | 'Tile' | 'Bitumen' | 'Other') => setFormData({ ...formData, roofType: value })}
            value={formData.roofType}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {['Iron', 'Tile', 'Bitumen', 'Other'].map(type => (
               <div key={type}>
                <RadioGroupItem value={type} id={`roof-${type}`} className="sr-only" />
                <Label htmlFor={`roof-${type}`} className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-transparent bg-primary p-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 [&:has([data-state=checked])]:border-ring">
                  {type}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="ghost" onClick={handleBack} className="absolute left-6 top-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
              {currentStepInfo.title}
            </CardTitle>
             <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {renderStepContent()}
              <div className="flex justify-end">
                <Button size="lg" onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
