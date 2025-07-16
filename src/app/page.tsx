
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/page/hero';
import { TrustBanner } from '@/components/page/trust-banner';
import { CostsSection } from '@/components/page/costs-section';
import { ApproxCosts } from '@/components/page/approx-costs';
import { HowItWorks } from '@/components/page/how-it-works';
import { ChoosingPartner } from '@/components/page/choosing-partner';
import { SavingsSection } from '@/components/page/savings-section';
import { RoiSection } from '@/components/page/roi-section';
import { HybridSystem } from '@/components/page/hybrid-system';
import { QuoteFunnel } from '@/components/quote-funnel';
import type { QuoteData } from '@/components/quote-funnel';
import { Skeleton } from '@/components/ui/skeleton';

const FaqSection = lazy(() => import('@/components/page/faq-section'));

const USER_ID_KEY = 'pms_user_id';

function generateUserId() {
  return `PMS-${Math.random().toString(36).substring(2, 11)}`;
}

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
            <TrustBanner />
            <CostsSection />
            <ApproxCosts />
            <HowItWorks />
            <ChoosingPartner />
            <SavingsSection />
            <RoiSection />
            <HybridSystem />
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
