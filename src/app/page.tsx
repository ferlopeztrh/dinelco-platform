import { CtaSection } from "@/components/sections/cta-final-section";
import { DinelcoCardSection } from "@/components/sections/dinelco-card-section";
import { HeroSectionV2 } from "@/components/sections/hero-section-v2";
import { ProductsSection } from "@/components/sections/products-section";
import { SecureSection } from "@/components/sections/secure-section";
import { StatsSection } from "@/components/sections/stats-section";
import { WhySection } from "@/components/sections/why-section";
import { WelcomePopup } from "@/components/welcome-popup";

export default function Home() {
  return (
    <div>
      <WelcomePopup />
      <HeroSectionV2 />
      <WhySection />
      <DinelcoCardSection />
      <ProductsSection />
      <StatsSection />
      <SecureSection />
      <CtaSection />
    </div>
  );
}
