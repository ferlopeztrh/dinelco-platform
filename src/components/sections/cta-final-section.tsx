"use client";

import { SlideTextButton } from "@/components/ui/slide-text-button";

export const CtaSection = () => {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-primary py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center"
    >
      <h2
        id="cta-heading"
        className="font-gilroy font-semibold text-white text-4xl md:text-5xl leading-[1.15] tracking-tight max-w-2xl mb-8"
      >
        Si estás desarrollando para escalar, no hay alternativa
      </h2>
      <SlideTextButton
        as="link"
        href="/contacto"
        label="Contactar"
        className="px-6 py-3 rounded-md text-[15px] bg-white text-primary"
      />
    </section>
  );
};
