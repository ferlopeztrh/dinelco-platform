import { CtaSection } from "@/components/sections/cta-final-section";
import { DevSection } from "@/components/sections/dev-section";
import { DinelcoCardSection } from "@/components/sections/dinelco-card-section";
import { HeroSectionV2 } from "@/components/sections/hero-section-v2";
import { ProductsSection } from "@/components/sections/products-section";
import { SecureSection } from "@/components/sections/secure-section";
import { StatsSection } from "@/components/sections/stats-section";
import { WhySection } from "@/components/sections/why-section";

export default function Home() {
  return (
    <div>
      <HeroSectionV2 />
      <WhySection />
      <DinelcoCardSection />
      <ProductsSection />
      {/* <StatsSection /> */}
      <SecureSection />
      <DevSection />
      <CtaSection />
    </div>
  );
}
