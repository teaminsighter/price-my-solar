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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBanner />
        <CostsSection />
        <ApproxCosts />
        <HowItWorks />
        <ChoosingPartner />
        <SavingsSection />
        <RoiSection />
        <HybridSystem />
      </main>
      <Footer />
    </div>
  );
}
