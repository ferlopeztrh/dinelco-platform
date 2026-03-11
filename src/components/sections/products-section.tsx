"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useId, useCallback } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─────────────────────────────────────────────────────────────────────────────
// Datos
// ─────────────────────────────────────────────────────────────────────────────
interface Industry {
  id: string;
  label: string;
  description: string;
  href?: string;
  image?: string; // path al asset real cuando lo tengas
}

const industries: Industry[] = [
  {
    id: "comercio",
    label: "Comercio",
    description:
      "Unifica los pagos en tienda y online. Acepta cualquier método de pago y obtén visibilidad total de tus ventas en tiempo real.",
    href: "/industrias/comercio",
  },
  {
    id: "hosteleria",
    label: "Hostelería y viajes",
    description:
      "Gestiona pagos en múltiples propiedades y canales. Reduce el fraude y mejora la experiencia del huésped desde la reserva hasta el check-out.",
    href: "/industrias/hosteleria",
  },
  {
    id: "medios",
    label: "Medios digitales y contenido",
    description:
      "Optimiza suscripciones y pagos recurrentes. Maximiza la retención con lógica de reintentos inteligente y tokenización de tarjetas.",
    href: "/industrias/medios",
  },
  {
    id: "saas",
    label: "Plataformas SaaS y marketplaces",
    description:
      "Monetiza tu plataforma con pagos integrados. Divide pagos, gestiona onboarding de merchants y cumple con la normativa local.",
    href: "/industrias/saas",
  },
  {
    id: "alimentos",
    label: "Alimentos y bebidas",
    description:
      "Integra punto de venta y pagos en el móvil. Servicio más rápido, operaciones más fluidas y visibilidad total desde el terminal TPV hasta el pago.",
    href: "/industrias/alimentos",
  },
  {
    id: "financiero",
    label: "Servicios financieros",
    description:
      "Conecta la emisión, la adquisición y la tesorería en una sola plataforma. Diseñado para mantener el flujo de fondos y hacer crecer el negocio.",
    href: "/industrias/servicios-financieros",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Imagen — placeholder hasta tener assets
// ─────────────────────────────────────────────────────────────────────────────
function IndustryImage({ industry }: { industry: Industry }) {
  if (industry.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={industry.image}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center text-white/30 font-mono text-xs select-none bg-neutral-950"
      aria-hidden
    >
      imagen / video aquí
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export const ProductsSection = () => {
  const sectionId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [openValues, setOpenValues] = useState<string[]>([industries[0].id]);

  const handleValueChange = useCallback(
    (val: string[]) => {
      if (val.length === 0) return;
      const next =
        val.find((v) => !openValues.includes(v)) ?? val[val.length - 1];
      setOpenValues([next]);
    },
    [openValues],
  );

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top+=120",
          end: "bottom bottom",
          pin: el,
          pinSpacing: false,
          preventOverlaps: true,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        });

        const gradientSpan = el.querySelector<HTMLElement>("[data-gradient]");
        const placeholder = document.createComment("gradient-placeholder");
        gradientSpan?.parentNode?.replaceChild(placeholder, gradientSpan!);
        const split = new SplitText(el, { type: "words" });
        placeholder.parentNode?.replaceChild(gradientSpan!, placeholder);

        gsap.fromTo(
          [...split.words, gradientSpan].filter(Boolean),
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top top+=75",
              end: "10% top+=75",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        return () => split.revert();
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(el, { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <section
      ref={wrapperRef}
      aria-labelledby={`${sectionId}-heading`}
      className="mb-12"
    >
      {/* Título — pinneado en desktop, estático en mobile */}
      <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-20 md:pb-0 md:min-h-[50vh] md:h-[60vh]">
        <div ref={textRef} className="max-w-3xl">
          <h2
            id={`${sectionId}-heading`}
            className="text-2xl sm:text-3xl lg:text-4xl font-gilroy font-semibold leading-tight text-black"
          >
            Experiencia local. Confiabilidad probada. Impulsado por{" "}
            <strong
              data-gradient=""
              className="font-black bg-linear-to-r from-primary via-primary to-primary bg-clip-text text-transparent"
            >
              miles de millones de guaraníes en datos de transacciones
              procesadas.
            </strong>
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2">
        {/*
         * Panel derecho — imagen sticky (solo desktop).
         * En mobile este panel no se renderiza visualmente (hidden md:block),
         * la imagen va dentro del AccordionContent de cada item.
         */}
        <div
          className="hidden md:block order-last relative md:sticky md:top-0 md:h-screen overflow-hidden bg-neutral-950"
          aria-hidden="true"
          role="presentation"
        >
          {/*
           * Crossfade entre imágenes según el item abierto — desktop.
           * opacity transition → compositor GPU, sin reflow.
           */}
          {industries.map((industry) => (
            <div
              key={industry.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                openValues.includes(industry.id) ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            >
              <IndustryImage industry={industry} />
            </div>
          ))}
        </div>

        {/* Panel izquierdo — acordeón */}
        <div className="order-first md:order-first flex flex-col justify-end px-4 sm:px-6 lg:px-8 py-0 md:py-0 md:min-h-dvh">
          <Accordion
            value={openValues}
            onValueChange={handleValueChange}
            className="w-full"
          >
            {industries.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-t border-neutral-200 last:border-b"
              >
                <AccordionTrigger
                  className={cn(
                    "font-gilroy font-semibold text-lg sm:text-xl text-black py-5 sm:py-6 cursor-pointer transition-opacity duration-300",
                    !openValues.includes(item.id) &&
                      "opacity-60 hover:opacity-100",
                  )}
                >
                  {item.label}
                </AccordionTrigger>

                <AccordionContent>
                  {/*
                   * Imagen — solo visible en mobile (md:hidden).
                   * aspect-video da altura predecible → sin reflow al expandir.
                   * El acordeón ya maneja el expand con grid-template-rows,
                   * la imagen simplemente es parte del contenido que se revela.
                   */}
                  <div className="md:hidden w-full aspect-video overflow-hidden rounded-lg mb-4 bg-neutral-950">
                    <IndustryImage industry={item} />
                  </div>

                  <p className="text-sm sm:text-base font-notosans max-w-xl leading-relaxed text-black/75 mb-3">
                    {item.description}
                  </p>
                  <Link
                    href={item.href ?? "#"}
                    className="inline-flex items-center gap-1.5 text-base sm:text-lg font-gilroy font-medium text-black no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                    aria-label={`Ver más sobre ${item.label}`}
                  >
                    Ver más <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
