
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Sun, Zap, Percent } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from './ui/input';
import { saveQuoteToFirestore } from '@/app/actions';
import Image from 'next/image';

// Data structure for the entire funnel
export type QuoteData = {
  userId: string;
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
  savingsPercent?: number;
  firstName?: string;
  lastName?: string;
  financeInterest?: 'Why not!' | 'Will sort myself';
  email?: string;
  phone?: string;
  urlParams?: { [key: string]: string };
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
  { id: 'householdSize', title: 'How many people live at [address]?', type: 'slider', min: 1, max: 10, step: 1, required: true, condition: (data: QuoteData) => data.propertyType === 'RESIDENTIAL' },
  { id: 'commercialPropertyType', title: 'What type of commercial property?', options: ['Tenant', 'Owner Occupier', 'Landlord Only'], required: true, condition: (data: QuoteData) => data.propertyType === 'COMMERCIAL' },
  { id: 'leaseYears', title: 'How many years remain on your lease?', type: 'slider', min: 1, max: 10, step: 1, required: true, condition: (data: QuoteData) => data.commercialPropertyType === 'Tenant' },
  { id: 'sunCheck', title: 'Checking solar viability for your address...', type: 'animation', duration: 3000 },
  { id: 'monthlyBill', title: 'What’s your average monthly power bill?', type: 'slider', min: 75, max: 700, step: 5, required: true },
  { id: 'island', title: 'Where is your property located?', options: ['North Island', 'South Island'], required: true },
  { id: 'region', title: 'What region is your property in?', type: 'select', required: true, condition: (data: QuoteData) => !!data.island },
  { id: 'gridSellBackInterest', title: 'Would you consider selling solar power back to the grid?', options: ['Yes', 'Like to know more', 'No'], required: true },
  { id: 'changePowerCompanyInterest', title: 'Would you change power companies to earn more credits?', options: ['Yes', 'Like to know more', 'No'], required: true, condition: (data: QuoteData) => data.gridSellBackInterest !== 'No' },
  { id: 'loadingSavings', title: 'Calculating your potential savings...', type: 'animation', duration: 3000, condition: (data: QuoteData) => data.changePowerCompanyInterest !== 'No' && data.gridSellBackInterest !== 'No'},
  { id: 'summary', title: 'Just a moment...', type: 'summary', condition: (data: QuoteData) => data.gridSellBackInterest === 'No' || data.changePowerCompanyInterest === 'No' },
  { id: 'savingsCalculation', title: 'Potential Bill Reduction', type: 'calculation' },
  { id: 'costCalculation', title: "Let's work out the costs for solar at your address", type: 'transition' },
  { id: 'financeInterest', title: 'Do you want us to show you finance options?', options: ['Why not!', 'Will sort myself'], required: true },
  { id: 'contactInfo', title: 'Where should we send your quote?', type: 'contact' },
  { id: 'confirmation', title: 'Thank you!', type: 'finalConfirmation' }
];

type QuoteFunnelProps = {
  initialData: QuoteData;
  onExit: () => void;
};

// Helper function to push to dataLayer
const pushToDataLayer = (eventData: Record<string, any>) => {
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  } else {
    console.warn('GTM dataLayer not found.');
  }
};


export function QuoteFunnel({ initialData, onExit }: QuoteFunnelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<QuoteData>({ ...initialData });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [lastCompletedStep, setLastCompletedStep] = useState<string | null>(null);

  const visibleSteps = useMemo(() => funnelSteps.filter(step => !step.condition || step.condition(formData)), [formData]);
  
  const currentStepInfo = visibleSteps[stepIndex];
  const totalSteps = visibleSteps.length;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  useEffect(() => {
    // Fire funnel_start event on initial load
    pushToDataLayer({
      event: 'funnel_start',
      user_id: initialData.userId,
      address: initialData.address,
      property_type: initialData.propertyType,
    });
    
    // Set default monthly bill on mount if it's not set
    const monthlyBillStep = funnelSteps.find(step => step.id === 'monthlyBill');
    if (monthlyBillStep && typeof monthlyBillStep.min === 'number') {
      if (formData.monthlyBill === undefined) {
         setFormData(prev => ({ ...prev, monthlyBill: monthlyBillStep.min }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentStepInfo?.type === 'animation' || currentStepInfo?.type === 'summary') {
      const timer = setTimeout(() => {
        handleNext();
      }, currentStepInfo.duration || 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, currentStepInfo]);

  useEffect(() => {
    if (formData.monthlyBill !== undefined) {
      let savings = 0;
      if (formData.monthlyBill < 201) {
        savings = 62;
      } else if (formData.monthlyBill >= 201 && formData.monthlyBill <= 350) {
        savings = 54;
      } else if (formData.monthlyBill > 350) {
        savings = 47;
      }
      setFormData(prev => ({ ...prev, savingsPercent: savings }));
    }
  }, [formData.monthlyBill]);
  
  useEffect(() => {
    if (lastCompletedStep && lastCompletedStep !== 'contactInfo' && formData[lastCompletedStep as keyof QuoteData]) {
        // Find the index of the step that was just completed
        const completedStepConfig = funnelSteps.find(s => s.id === lastCompletedStep);
        // Only auto-advance if the step is not a slider or contact form
        if (completedStepConfig && completedStepConfig.type !== 'slider') {
            handleNext();
        }
        setLastCompletedStep(null); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [formData, lastCompletedStep]);


  const transition = (callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  };
  
  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
        transition(() => setStepIndex(s => s + 1));
    } else {
        console.log('Funnel complete:', formData);
    }
  };

  const handleBack = () => {
    const currentStepId = currentStepInfo?.id;
  
    if (currentStepId === 'monthlyBill') {
      const prevStepKey = formData.propertyType === 'RESIDENTIAL' ? 'householdSize' : 'commercialPropertyType';
      const prevStepIndex = visibleSteps.findIndex(s => s.id === prevStepKey);
      
      // We actually need to find the step before that, which is roofType
      const roofTypeIndex = visibleSteps.findIndex(s => s.id === 'roofType');

      if (roofTypeIndex !== -1) {
          // Find the step before the animation
          const stepBeforeAnimation = visibleSteps.findIndex(s => s.id === 'householdSize' || s.id === 'commercialPropertyType');
          if (stepBeforeAnimation !== -1) {
             const targetStep = visibleSteps[stepBeforeAnimation - 1]; // This should be 'roofType'
             const targetIndex = visibleSteps.findIndex(s => s.id === targetStep.id);
             if(targetIndex !== -1) {
                transition(() => setStepIndex(targetIndex));
                return;
             }
          }
      }
    }
    
    if (currentStepId === 'savingsCalculation') {
       const gridSellBackStepIndex = visibleSteps.findIndex(s => s.id === 'gridSellBackInterest');
       if (gridSellBackStepIndex !== -1) {
         transition(() => setStepIndex(gridSellBackStepIndex));
         return;
       }
    }

    if (stepIndex > 0) {
        transition(() => setStepIndex(s => s - 1));
    } else {
        onExit();
    }
  };

  const handleSelectAndNext = (key: keyof QuoteData, value: any) => {
    const stepInfo = funnelSteps.find(s => s.id === key);
    pushToDataLayer({
        event: 'funnel_step_completion',
        user_id: formData.userId,
        step_id: key,
        step_title: stepInfo?.title.replace('[address]', formData.address) || key,
        value: value,
    });
    setFormData(prev => ({ ...prev, [key]: value }));
    setLastCompletedStep(key);
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStepInfo.id === 'contactInfo') {
      setLastCompletedStep('contactInfo');
      setIsSubmitting(true);
      try {
        const result = await saveQuoteToFirestore(formData);
        if (result.success) {
          // Push to dataLayer
          pushToDataLayer({
            event: 'generate_quote',
            user_id: formData.userId,
            lead_data: { ...formData }
          });
          handleNext();
        } else {
          console.error("Submission Error:", result.error);
          alert("There was a problem saving your quote. Please try again.");
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
        // Handle "Next" button on slider steps
        const stepInfo = funnelSteps.find(s => s.id === currentStepInfo.id);
        pushToDataLayer({
            event: 'funnel_step_completion',
            user_id: formData.userId,
            step_id: currentStepInfo.id,
            step_title: stepInfo?.title.replace('[address]', formData.address) || currentStepInfo.id,
            value: formData[currentStepInfo.id as keyof QuoteData],
        });
        handleNext();
    }
  }

  const renderStepContent = () => {
    const contentClasses = `transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`;

    if (!currentStepInfo) {
        return <div className="min-h-[350px] flex items-center justify-center">Loading step...</div>;
    }
    
    const { id, type, options, min, max, step, autocomplete } = currentStepInfo;

    if (type === undefined || id === 'region') {
      if (options) { // Buttons for options
          return (
            <div className={`flex flex-col gap-4 text-center ${contentClasses}`}>
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                {currentStepInfo.title.replace('[address]', formData.address)}
              </CardTitle>
              <div className="flex flex-col gap-3 pt-4">
                <div className="grid flex-grow grid-cols-1 gap-3 sm:grid-cols-2">
                  {options.map(option => (
                    <Button
                      key={option}
                      size="lg"
                      variant={formData[id as keyof QuoteData] === option ? 'default' : 'outline'}
                      className="h-auto p-4 text-base transition-transform hover:scale-105"
                      onClick={() => handleSelectAndNext(id as keyof QuoteData, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          );
      } else if (id === 'region') { // Region select
          const islandRegions = regions[formData.island as keyof typeof regions] || [];
           return (
            <div className={`flex flex-col gap-4 text-center ${contentClasses}`}>
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                {currentStepInfo.title.replace('[address]', formData.address)}
              </CardTitle>
              <div className="flex flex-col gap-3 pt-4">
                <div className="grid flex-grow grid-cols-2 gap-3 md:grid-cols-3">
                  {islandRegions.map(region => (
                    <Button
                      key={region}
                      size="lg"
                      variant={formData.region === region ? 'default' : 'outline'}
                      className="h-auto p-4 text-base transition-transform hover:scale-105"
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

    if (type === 'slider') {
        const value = formData[id as keyof QuoteData] as number || min!;
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let numValue = parseInt(e.target.value, 10);
            if (isNaN(numValue)) numValue = min!;
            if (numValue < min!) numValue = min!;
            if (numValue > max!) numValue = max!;
            setFormData({ ...formData, [id]: numValue });
        };
        const householdLabels = id === 'householdSize' ? Array.from({ length: max! }, (_, i) => i + 1) : null;

        return (
          <form onSubmit={handleFormSubmit} className={`flex flex-col gap-8 text-center pt-4 ${contentClasses}`}>
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
              {currentStepInfo.title.replace('[address]', formData.address)}
            </CardTitle>

            <div className="flex w-full items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center gap-4">
                 <div className="flex items-baseline justify-center font-bold text-primary text-5xl">
                  {id === 'monthlyBill' && <span>$</span>}
                   <Input
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    className="w-auto border-0 bg-transparent p-0 text-center text-5xl font-bold text-primary shadow-none focus-visible:ring-0"
                    style={{width: `${String(value).length + 2}ch`}}
                  />
                  {id === 'monthlyBill' && <span className="text-3xl font-normal self-end">/mo</span>}
                </div>
                <div className="w-full max-w-sm">
                  <Slider value={[value]} onValueChange={([val]) => setFormData({ ...formData, [id]: val })} min={min} max={max} step={step} />
                  {householdLabels && (
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                        {householdLabels.map(label => (
                            <span key={label} className={`w-1/10 text-center ${value === label ? 'font-bold text-primary' : ''}`}>
                                {label}{label === max! ? '+' : ''}
                            </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <Button size="lg" type="submit">Next</Button>
            </div>
          </form>
        );
    }
    
    switch (type) {
      case 'animation':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center min-h-[350px]">
             { id === 'sunCheck' ? 
                <Sun className="h-16 w-16 animate-spin text-primary" /> : 
                <Zap className="h-16 w-16 animate-pulse text-primary" /> }
            <p className="text-muted-foreground">{currentStepInfo.title}</p>
          </div>
        );
      case 'summary':
          return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center min-h-[350px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p>Redirecting you based on your answers...</p>
            </div>
          );
      case 'calculation':
          return (
            <div className={`text-center space-y-6 ${contentClasses}`}>
              <div className="flex justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                  <Percent className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-lg text-muted-foreground">Based on your usage, you could save</p>
                <h2 className="text-4xl font-bold text-primary">up to {formData.savingsPercent}%</h2>
                <p className="mt-1 text-lg text-muted-foreground">on your monthly power bill!</p>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <Button size="lg" onClick={handleNext}>See How</Button>
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
            <div className={`flex flex-col gap-4 text-center ${contentClasses}`}>
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                {currentStepInfo.title.replace('[address]', formData.address)}
              </CardTitle>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 pt-4">
                <Input
                  type={type}
                  placeholder={currentStepInfo.title}
                  value={formData[id as keyof QuoteData] as string || ''}
                  onChange={(e) => setFormData({...formData, [id]: e.target.value})}
                  required={currentStepInfo.required}
                  autoComplete={autocomplete}
                  className="h-12 text-center"
                />
                <div className="mt-6 flex items-center justify-center">
                  <Button size="lg" type="submit">Next</Button>
                </div>
              </form>
            </div>
          )
      case 'contact':
        return (
          <div className={`flex flex-col gap-4 text-center ${contentClasses}`}>
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                {currentStepInfo.title.replace('[address]', formData.address)}
            </CardTitle>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 pt-4 max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  autoComplete="given-name"
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  autoComplete="family-name"
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                autoComplete="tel"
              />
              <div className="mt-6 flex items-center justify-center">
                  <Button size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Get My Quote'}
                  </Button>
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
                <p className="text-muted-foreground max-w-md mx-auto">Your quote request has been submitted. We'll be in touch at <strong>{formData.email}</strong> and <strong>{formData.phone}</strong> shortly with your personalized solar options.</p>
                <Button size="lg" onClick={onExit} className="mt-4">Return to Homepage</Button>
            </div>
        );

      default:
        return (
          <div className="min-h-[350px] flex items-center justify-center">
             <Button variant="outline" onClick={handleBack} className="absolute top-8 left-8">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
             </Button>
          </div>
        );
    }
  };

  return (
    <section className="w-full bg-slate-50 py-12 md:py-20 lg:py-24 min-h-[80vh] flex flex-col items-center justify-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start">
            <div className="hidden md:flex justify-center items-start h-full">
                <div className="sticky top-24 w-80 h-[500px]">
                     <div className="w-full h-full bg-transparent rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FTiers%2Fsolar%20(1).jpg?alt=media&token=9687ffcd-c763-4d11-8edf-6b9bf17398ef"
                          alt="Solar panels on a sunny day"
                          width={600}
                          height={800}
                          className="w-full h-full object-contain"
                          data-ai-hint="solar panels"
                          priority
                        />
                     </div>
                </div>
            </div>
            
            <div className="md:col-span-2 flex justify-start px-4 md:px-0">
                 <div className="w-full max-w-2xl">
                    <div className="relative mb-2">
                        <Progress value={progress} className="h-3" />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {progress}%
                        </span>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mb-8">Step {stepIndex + 1} of {totalSteps}</p>

                    <Card className="w-full shadow-none border-0 bg-transparent min-h-[400px]">
                        <CardContent className="flex flex-col justify-center p-2 md:p-6 h-full">
                            {isTransitioning ? (
                                <div className="min-h-[350px] flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : renderStepContent()}
                        </CardContent>
                    </Card>
                    <div className="flex justify-start mt-4">
                        {(currentStepInfo?.type !== 'finalConfirmation' && currentStepInfo?.type !== 'animation' && !isTransitioning) && (
                             <Button variant="link" onClick={handleBack} className="text-muted-foreground">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
