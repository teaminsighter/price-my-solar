
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from './ui/input';

export type QuoteData = {
  address: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL';
  ownProperty?: 'Yes' | 'No';
  roofType?: 'Iron' | 'Tile' | 'Bitumen' | 'Other';
  monthlyBill?: number;
  householdSize?: number;
  financeOptions?: 'Why not!' | 'Will sort myself';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

type QuoteFunnelProps = {
  initialData: QuoteData;
  onExit: () => void;
};

const funnelSteps = [
  { id: 'ownProperty', title: 'Do you own the property?', options: ['Yes', 'No'] },
  { id: 'roofType', title: 'What type of roof do you have?', options: ['Iron', 'Tile', 'Bitumen', 'Other'] },
  { id: 'monthlyBill', title: 'What’s your average monthly power bill?', type: 'slider', min: 50, max: 1000, step: 10 },
  { id: 'householdSize', title: 'How many people live at your address?', type: 'slider', min: 1, max: 10, step: 1 },
  { id: 'financeOptions', title: 'Do you want us to show you some finance options?', options: ['Why not!', 'Will sort myself'] },
  { id: 'contactInfo', title: 'Where should we send your quote?' },
  { id: 'confirmation', title: 'Thank you!'}
];

export function QuoteFunnel({ initialData, onExit }: QuoteFunnelProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuoteData>(initialData);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSteps = funnelSteps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        if (step < totalSteps - 1) {
            setStep(s => s + 1);
        } else {
            console.log('Funnel complete:', formData);
        }
        setIsTransitioning(false);
    }, 300);
  };
  
  const handleSelectAndNext = (key: keyof QuoteData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    handleNext();
  };


  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onExit();
    }
  };
  
  const currentStepInfo = funnelSteps[step];

  const BackButton = () => {
    if (step === 0) return <div style={{width: '98px'}} />;
    return (
        <Button variant="outline" size="lg" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
    )
  }

  const renderStepContent = () => {
    if (isTransitioning) return <div className="min-h-[250px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

    switch (currentStepInfo.id) {
      case 'ownProperty':
      case 'roofType':
      case 'financeOptions':
        return (
          <div className="flex flex-col gap-4">
            <div className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2">
                {currentStepInfo.options?.map(option => (
                <Button
                    key={option}
                    variant={formData[currentStepInfo.id as keyof QuoteData] === option ? 'default' : 'outline'}
                    className="h-auto p-6 text-lg"
                    onClick={() => handleSelectAndNext(currentStepInfo.id as keyof QuoteData, option)}
                >
                    {option}
                </Button>
                ))}
            </div>
             <div className="mt-6 flex items-center justify-start">
                <BackButton />
            </div>
          </div>
        );
       case 'monthlyBill':
        return (
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex-grow space-y-6">
                <div className="text-center text-4xl font-bold text-primary">
                    ${formData.monthlyBill ?? currentStepInfo.min}
                </div>
                <Slider
                value={[formData.monthlyBill ?? currentStepInfo.min!]}
                onValueChange={([value]) => setFormData({ ...formData, monthlyBill: value })}
                min={currentStepInfo.min}
                max={currentStepInfo.max}
                step={currentStepInfo.step}
                />
            </div>
            <div className="mt-6 flex items-center justify-between">
                <BackButton />
                <Button size="lg" onClick={handleNext}>Next</Button>
            </div>
          </div>
        );
      case 'householdSize':
        return (
           <div className="flex flex-col gap-4 pt-4">
            <div className="flex-grow space-y-6">
              <div className="text-center text-4xl font-bold text-primary">
                  {formData.householdSize ?? currentStepInfo.min}{formData.householdSize === currentStepInfo.max ? '+' : ''}
              </div>
              <Slider
                value={[formData.householdSize ?? currentStepInfo.min!]}
                onValueChange={([value]) => setFormData({ ...formData, householdSize: value })}
                min={currentStepInfo.min}
                max={currentStepInfo.max}
                step={currentStepInfo.step}
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
                <BackButton />
                <Button size="lg" onClick={handleNext}>Next</Button>
            </div>
          </div>
        );
      case 'contactInfo':
        return (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex flex-col gap-4">
            <div className="flex-grow space-y-4">
              <Input 
                placeholder="First Name" 
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input 
                placeholder="Last Name" 
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
              <Input 
                type="email"
                placeholder="Email Address" 
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input 
                type="tel"
                placeholder="Phone Number" 
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
                <BackButton />
                <Button size="lg" type="submit">Get My Quote</Button>
            </div>
          </form>
        );
      case 'confirmation':
        return (
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Thank you, {formData.firstName}!</h2>
                <p className="text-muted-foreground">Your quote is being generated and will be sent to <strong>{formData.email}</strong> shortly.</p>
                <p>We will also send a confirmation via SMS to <strong>{formData.phone}</strong>.</p>
                 <Button size="lg" onClick={onExit} className="mt-4">Return to Homepage</Button>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-slate-100 py-12 md:py-20 lg:py-24 min-h-[60vh]">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-2xl shadow-lg">
          <CardHeader className="text-center relative">
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
              {currentStepInfo.title}
            </CardTitle>
             <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col justify-center">
             {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
