import type { Metadata, Viewport } from "next";
import { CtaSection } from "@/components/sections/cta-final-section";
import { DevSection } from "@/components/sections/dev-section";
import { DinelcoCardSection } from "@/components/sections/dinelco-card-section";
import { HeroSectionV2 } from "@/components/sections/hero-section-v2";
import { ProductsSection } from "@/components/sections/products-section";
import { SecureSection } from "@/components/sections/secure-section";
import { StatsSection } from "@/components/sections/stats-section";
import { WhySection } from "@/components/sections/why-section";

// ─── SEO / Open Graph ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Dinelco · La red de pagos en la que confían los negocios paraguayos",
  description:
    "Pagos, datos y productos financieros para empresas que eligen crecer. Infraestructura con certificación PCI DSS, 3D Secure, Google Pay y tokenización.",
  keywords: [
    "pagos Paraguay",
    "fintech Paraguay",
    "pasarela de pagos",
    "POS Paraguay",
    "3D Secure",
    "BEPSA",
    "Dinelco",
    "procesamiento de pagos",
  ],
  authors: [{ name: "Dinelco / BEPSA" }],
  creator: "Dinelco",
  publisher: "BEPSA",
  metadataBase: new URL("https://dinelco.com.py"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dinelco · Pagos que impulsan tu negocio",
    description:
      "La infraestructura de pagos más confiable de Paraguay. PCI DSS, 99,999 % de uptime y API REST lista para producción.",
    url: "https://dinelco.com.py",
    siteName: "Dinelco",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dinelco — Red de pagos de Paraguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinelco · Pagos que impulsan tu negocio",
    description: "La infraestructura de pagos más confiable de Paraguay.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// ─── Structured data (JSON-LD) ───────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dinelco",
  url: "https://dinelco.com.py",
  logo: "https://dinelco.com.py/assets/dinelco/isologo-white.svg",
  description: "Red de pagos y productos financieros para negocios paraguayos.",
  parentOrganization: { "@type": "Organization", name: "BEPSA" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: "PY",
    availableLanguage: "Spanish",
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
        <HeroSectionV2 />
        <WhySection />
        <DinelcoCardSection />
        <ProductsSection />
        <StatsSection />
        <SecureSection />
        <DevSection />
        <CtaSection />
      </main>
    </>
  );
}
