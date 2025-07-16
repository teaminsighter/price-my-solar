
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/page/hero';
import { QuoteFunnel } from '@/components/quote-funnel';
import type { QuoteData } from '@/components/quote-funnel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CostsSection = lazy(() => import('@/components/page/costs-section').then(m => ({ default: m.CostsSection })));
const ApproxCosts = lazy(() => import('@/components/page/approx-costs').then(m => ({ default: m.ApproxCosts })));
const HowItWorks = lazy(() => import('@/components/page/how-it-works').then(m => ({ default: m.HowItWorks })));
const ChoosingPartner = lazy(() => import('@/components/page/choosing-partner').then(m => ({ default: m.ChoosingPartner })));
const SavingsSection = lazy(() => import('@/components/page/savings-section').then(m => ({ default: m.SavingsSection })));
const RoiSection = lazy(() => import('@/components/page/roi-section').then(m => ({ default: m.RoiSection })));
const HybridSystem = lazy(() => import('@/components/page/hybrid-system').then(m => ({ default: m.HybridSystem })));
const FaqSection = lazy(() => import('@/components/page/faq-section'));


const USER_ID_KEY = 'pms_user_id';

function generateUserId() {
  return `PMS-${Math.random().toString(36).substring(2, 11)}`;
}

const SectionSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("w-full h-96 bg-muted/50", className)}></div>
);

export default function Home() {
  const [funnelStarted, setFunnelStarted] = useState(false);
  const [initialQuoteData, setInitialQuoteData] = useState<QuoteData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = generateUserId();
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const handleStartFunnel = (data: Omit<QuoteData, 'userId'>) => {
    if (userId) {
      setInitialQuoteData({ ...data, userId });
      setFunnelStarted(true);
    }
  };

  const handleExitFunnel = () => {
    setFunnelStarted(false);
    setInitialQuoteData(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {funnelStarted && initialQuoteData ? (
          <QuoteFunnel initialData={initialQuoteData} onExit={handleExitFunnel} />
        ) : (
          <>
            <Hero onStartFunnel={handleStartFunnel} />
            <Suspense fallback={<SectionSkeleton />}>
              <CostsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <ApproxCosts />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <HowItWorks />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <ChoosingPartner />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <SavingsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <RoiSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <HybridSystem />
            </Suspense>
            <Suspense fallback={
              <section className="w-full bg-card py-12 md:py-20 lg:py-24">
                <div className="container mx-auto max-w-4xl px-4 md:px-6">
                  <div className="mx-auto max-w-3xl text-center">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                  </div>
                  <div className="mt-12 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              </section>
            }>
              <FaqSection />
            </Suspense>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
