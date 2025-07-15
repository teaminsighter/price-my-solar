
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Sun, Zap, Percent } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from './ui/input';

// Data structure for the entire funnel
export type QuoteData = {
  address: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL';
  motivation?: string;
  roofType?: string;
  householdSize?: number;
  commercialPropertyType?: 'Tenant' | 'Owner Occupier' | 'Landlord Only';
  leaseYears?: number;
  monthlyBill?: number;
  island?: 'North Island' | 'South Island';
  region?: string;
  gridSellBackInterest?: 'Yes' | 'Like to know more' | 'No';
  changePowerCompanyInterest?: 'Yes' | 'Like to know more' | 'No';
  confirmPowerCompanySwitch?: 'Yes' | 'Like to know more' | 'No';
  savingsPercent?: number;
  firstName?: string;
  lastName?: string;
  financeInterest?: 'Why not!' | 'Will sort myself';
  email?: string;
  phone?: string;
  emailConfirm?: string;
  phoneConfirm?: string;
};

// Regions data
const regions = {
  "North Island": ["Northland", "Auckland", "Waikato", "Bay of Plenty", "Gisborne", "Hawke's Bay", "Taranaki", "Manawatū-Whanganui", "Wellington"],
  "South Island": ["Tasman", "Nelson", "Marlborough", "West Coast", "Canterbury", "Otago", "Southland"]
};

// All funnel steps definition
const funnelSteps = [
  // Step 1: Address handled by Hero component
  { id: 'motivation', title: 'What’s your primary reason for wanting solar?', options: ['The environment', 'Save power/Cut costs', 'Self-sufficient', 'Off the grid', 'All of the above'], required: true },
  { id: 'roofType', title: 'What is the substrate of your roof?', options: ['Iron/Metal', 'Tile (Concrete/Long run)', 'Bitumen', 'Asphalt shingles', 'Other/Not sure'], required: true },
  { id: 'householdSize', title: 'How many people live at your address?', type: 'slider', min: 1, max: 10, step: 1, required: true, condition: (data: QuoteData) => data.propertyType === 'RESIDENTIAL' },
  { id: 'commercialPropertyType', title: 'What type of commercial property?', options: ['Tenant', 'Owner Occupier', 'Landlord Only'], required: true, condition: (data: QuoteData) => data.propertyType === 'COMMERCIAL' },
  { id: 'leaseYears', title: 'How many years remain on your lease?', type: 'slider', min: 1, max: 10, step: 1, required: true, condition: (data: QuoteData) => data.commercialPropertyType === 'Tenant' },
  { id: 'monthlyBill', title: 'What’s your average monthly power bill?', type: 'slider', min: 75, max: 700, step: 5, required: true },
  { id: 'sunCheck', title: 'Checking solar viability for your address...', type: 'animation', duration: 3000 },
  { id: 'island', title: 'Where is your property located?', options: ['North Island', 'South Island'], required: true },
  { id: 'region', title: 'What region is your property in?', type: 'select', required: true, condition: (data: QuoteData) => !!data.island },
  { id: 'gridSellBackInterest', title: 'Would you consider selling solar power back to the grid?', options: ['Yes', 'Like to know more', 'No'], required: true },
  { id: 'changePowerCompanyInterest', title: 'Would you change power companies to earn more credits?', options: ['Yes', 'Like to know more', 'No'], required: true, condition: (data: QuoteData) => data.gridSellBackInterest !== 'No' },
  { id: 'confirmPowerCompanySwitch', title: 'Would you swap power companies to earn more credits?', options: ['Yes', 'Like to know more', 'No'], required: true, condition: (data: QuoteData) => data.changePowerCompanyInterest !== 'No' },
  { id: 'loadingSavings', title: 'Calculating your potential savings...', type: 'animation', duration: 3000, condition: (data: QuoteData) => data.confirmPowerCompanySwitch !== 'No' && data.changePowerCompanyInterest !== 'No' && data.gridSellBackInterest !== 'No'},
  { id: 'summary', title: 'Just a moment...', type: 'summary', condition: (data: QuoteData) => data.gridSellBackInterest === 'No' || data.changePowerCompanyInterest === 'No' || data.confirmPowerCompanySwitch === 'No' },
  { id: 'savingsCalculation', title: 'Potential Bill Reduction', type: 'calculation' },
  { id: 'costCalculation', title: "Let's work out the costs for Solar at your address", type: 'transition' },
  { id: 'firstName', title: 'What is your first name?', type: 'text', required: true },
  { id: 'lastName', title: 'And your last name?', type: 'text', required: true },
  { id: 'financeInterest', title: 'Do you want us to show you finance options?', options: ['Why not!', 'Will sort myself'], required: true },
  { id: 'contactInfo', title: 'Where should we send your quote?', type: 'contact' },
  { id: 'emailConfirm', title: 'Confirm your email (optional)', type: 'email' },
  { id: 'phoneConfirm', title: 'Confirm your phone (optional)', type: 'tel' },
  { id: 'confirmation', title: 'Thank you!', type: 'finalConfirmation' }
];

type QuoteFunnelProps = {
  initialData: QuoteData;
  onExit: () => void;
};

export function QuoteFunnel({ initialData, onExit }: QuoteFunnelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<QuoteData>({ ...initialData });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filter steps based on conditional logic
  const visibleSteps = useMemo(() => funnelSteps.filter(step => !step.condition || step.condition(formData)), [formData]);
  
  const currentStepInfo = visibleSteps[stepIndex];
  const totalSteps = visibleSteps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  useEffect(() => {
    if (currentStepInfo?.type === 'animation' || currentStepInfo?.type === 'summary') {
      const timer = setTimeout(() => {
        handleNext();
      }, currentStepInfo.duration || 2000);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, currentStepInfo]);

  useEffect(() => {
    // Auto-calculate savings when monthlyBill is available
    if (formData.monthlyBill && !formData.savingsPercent) {
      let savings = 0;
      if (formData.monthlyBill < 201) savings = 62;
      else if (formData.monthlyBill >= 201 && formData.monthlyBill <= 350) savings = 54;
      else savings = 47;
      setFormData(prev => ({ ...prev, savingsPercent: savings }));
    }
  }, [formData.monthlyBill, formData.savingsPercent]);

  const transition = (callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  };
  
  const handleNext = () => {
    transition(() => {
      if (stepIndex < totalSteps - 1) {
        setStepIndex(s => s + 1);
      } else {
        // Funnel complete
        console.log('Funnel complete:', formData);
        onExit();
      }
    });
  };

  const handleBack = () => {
    transition(() => {
      if (stepIndex > 0) {
        setStepIndex(s => s - 1);
      } else {
        onExit();
      }
    });
  };

  const handleSelectAndNext = (key: keyof QuoteData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    handleNext();
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  }

  const BackButton = () => {
    if (currentStepInfo?.type === 'finalConfirmation' || currentStepInfo?.type === 'animation') return <div style={{width: '98px'}} />;
    
    return (
      <Button variant="outline" onClick={handleBack} className="bg-transparent border-gray-300 hover:bg-gray-100">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
    )
  }

  const renderStepContent = () => {
    const animationClass = isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100';
    const contentClasses = `transition-all duration-300 ease-in-out ${animationClass}`;

    if (!currentStepInfo) {
        return <div className="min-h-[250px] flex items-center justify-center">Loading step...</div>;
    }

    if (isTransitioning && currentStepInfo.type !== 'animation') {
        return <div className="min-h-[250px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
    }

    const { id, type, options, min, max, step } = currentStepInfo;

    // Default option-based steps
    if (type === undefined || type === 'select' || (type === 'slider' && !isTransitioning)) {
        if (options) { // Buttons for options
            return (
              <div className={contentClasses}>
                <div className="flex flex-col gap-3">
                  <div className="grid flex-grow grid-cols-1 gap-3 md:grid-cols-2">
                    {options.map(option => (
                      <Button
                        key={option}
                        variant={formData[id as keyof QuoteData] === option ? 'default' : 'outline'}
                        className="h-auto p-3 text-xs md:text-sm transition-transform hover:scale-105"
                        onClick={() => handleSelectAndNext(id as keyof QuoteData, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
        } else if (type === 'slider') { // Slider steps
            const value = formData[id as keyof QuoteData] as number || min!;
             return (
              <div className={contentClasses}>
                <div className="flex flex-col gap-8 pt-4">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center justify-center text-5xl font-bold text-primary">
                      {id === 'monthlyBill' && <span>$</span>}
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          let numValue = parseInt(e.target.value, 10);
                          if (isNaN(numValue)) numValue = min!;
                          if (numValue > max!) numValue = max!;
                          setFormData({ ...formData, [id]: numValue })
                        }}
                        className="w-auto border-0 bg-transparent p-0 text-center text-5xl font-bold text-primary shadow-none focus-visible:ring-0"
                        style={{width: `${value.toString().length + 1}ch`}}
                      />
                      { (id === 'householdSize' || id === 'leaseYears') && value === max! && <span>+</span> }
                    </div>
                    <Slider value={[value]} onValueChange={([val]) => setFormData({ ...formData, [id]: val })} min={min} max={max} step={step} />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <BackButton />
                    <Button size="lg" onClick={handleNext}>Next</Button>
                  </div>
                </div>
              </div>
            );
        } else if (type === 'select') { // Region select
            const islandRegions = regions[formData.island as keyof typeof regions] || [];
             return (
              <div className={contentClasses}>
                <div className="flex flex-col gap-3">
                  <div className="grid flex-grow grid-cols-2 gap-3 md:grid-cols-3">
                    {islandRegions.map(region => (
                      <Button
                        key={region}
                        variant={formData.region === region ? 'default' : 'outline'}
                        className="h-auto p-3 text-xs md:text-sm transition-transform hover:scale-105"
                        onClick={() => handleSelectAndNext('region', region)}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
        }
    }
    
    switch (type) {
      case 'animation':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
             { id === 'sunCheck' ? 
                <Sun className="h-16 w-16 animate-spin text-primary" /> : 
                <Zap className="h-16 w-16 animate-pulse text-primary" /> }
            <p className="text-muted-foreground">{currentStepInfo.title}</p>
          </div>
        );
      case 'summary':
          return <div className="text-center"><p>Redirecting you based on your answers...</p></div>
      case 'calculation':
          return (
            <div className={`text-center space-y-4 ${contentClasses}`}>
                <div className="flex justify-center">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                        <Percent className="h-16 w-16 text-green-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold">We could reduce your bill by <span className="text-primary">{formData.savingsPercent}%</span></h2>
                <div className="mt-6 flex items-center justify-center">
                    <Button size="lg" onClick={handleNext}>Continue</Button>
                </div>
            </div>
          );
      case 'transition':
          return (
             <div className={`text-center space-y-4 ${contentClasses}`}>
                <h2 className="text-2xl font-bold">{currentStepInfo.title.replace('[address]', formData.address)}</h2>
                <div className="mt-6 flex items-center justify-center">
                    <Button size="lg" onClick={handleNext}>Let's Go</Button>
                </div>
             </div>
          );
      case 'text':
      case 'email':
      case 'tel':
          return (
            <div className={contentClasses}>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <Input
                  type={type}
                  placeholder={currentStepInfo.title}
                  value={formData[id as keyof QuoteData] as string || ''}
                  onChange={(e) => setFormData({...formData, [id]: e.target.value})}
                  required={currentStepInfo.required}
                  className="h-12 text-center"
                />
                <div className="mt-6 flex items-center justify-between">
                  <BackButton />
                  <Button size="lg" type="submit">Next</Button>
                </div>
              </form>
            </div>
          )
      case 'contact':
        return (
          <div className={contentClasses}>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <div className="mt-6 flex items-center justify-between">
                  <BackButton />
                  <Button size="lg" type="submit">Get My Quote</Button>
              </div>
            </form>
          </div>
        );
      case 'finalConfirmation':
        return (
            <div className={`text-center space-y-4 ${contentClasses}`}>
                <div className="flex justify-center">
                   <Check className="h-16 w-16 rounded-full bg-green-100 p-2 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Thank you, {formData.firstName}!</h2>
                <p className="text-muted-foreground">Your quote request has been submitted. We'll be in touch at <strong>{formData.email}</strong> and <strong>{formData.phone}</strong> shortly.</p>
                <Button size="lg" onClick={onExit} className="mt-4">Return to Homepage</Button>
            </div>
        );

      default:
        return <div className="min-h-[250px]"><BackButton /></div>;
    }
  };

  return (
    <section className="w-full bg-slate-100 py-12 md:py-20 lg:py-24 min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-2xl shadow-lg rounded-xl">
          <CardHeader className="text-center relative p-6 space-y-4">
             {currentStepInfo?.type !== 'finalConfirmation' && (
                <>
                    <div className="w-full px-6 absolute top-6 left-0">
                        <Progress value={progress} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground pt-4">Step {stepIndex + 1} of {totalSteps}</p>
                </>
             )}
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl pt-4">
              {currentStepInfo?.title.replace('[address]', formData.address)}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[250px] flex flex-col justify-center p-6">
             {renderStepContent()}
             {/* Render Back button here for steps without explicit nav buttons */}
             { (currentStepInfo?.type === undefined || currentStepInfo?.type === 'select') &&
                <div className="mt-6 flex items-center justify-start">
                    <BackButton />
                </div>
             }
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

    