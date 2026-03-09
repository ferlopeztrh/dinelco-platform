"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSplitText } from "@/hooks/use-split-text";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Cumplimiento normativo en el que puedes confiar.",
    description:
      "Respaldado por licencias de procesamiento de pagos con los más altos estándares de seguridad.",
  },
  {
    title: "Fiabilidad de nivel empresarial",
    description: "99,999 % de tiempo de actividad histórico de la plataforma.",
  },
  {
    title: "Una sola plataforma",
    description:
      "Pagos, información sobre datos y productos financieros en un solo lugar.",
  },
  {
    title: "Optimizaciones integradas",
    description:
      "Mejora la conversión, reduce el fraude y disminuye los costos de pago.",
  },
  {
    title: "Fácil de integrar",
    description: "Una API que admite múltiples canales de venta.",
  },
];

export const WhySection = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<HTMLElement[]>([]);

  // Hook — solo anima, no toca clases ni estructura
  const titleRef = useSplitText<HTMLParagraphElement>({
    splitType: "lines",
    duration: 0.75,
    stagger: 0.08,
    ease: "power3.out",
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
    once: true,
    threshold: 0.15,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    update();
  }, [emblaApi]);

  useEffect(() => {
    const cards = cardEls.current.filter(Boolean);
    if (!cards.length) return;

    gsap.set(cards, { y: 100, scale: 0.95 });

    const cardSTs = cards.map((card, i) =>
      gsap.fromTo(
        card,
        { y: 100, scale: 0.95 },
        {
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: `top ${95 - i * 8}%`,
            end: `top ${45 - i * 4}%`,
            scrub: 1.2,
          },
        },
      ),
    );

    return () => {
      cardSTs.forEach((t) => t.scrollTrigger?.kill());
    };
  }, []);

  return (
    <section className="relative bg-white z-10" aria-label="Por qué elegirnos">
      <div className="pb-10 md:pb-16 px-6 pt-16 md:pt-28">
        <div className="max-w-3xl mx-auto">
          {/* El hook anima este elemento — los estilos y el HTML quedan intactos */}
          <p
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl font-gilroy font-semibold leading-[1.35] tracking-tight"
          >
            Tomá el control de tu negocio. La red dinelco ofrece el control, la
            fiabilidad y la infraestructura de pagos en la confían las{" "}
            <span className="font-black bg-linear-to-r from-primary via-primary via-0% to-secondary bg-clip-text text-transparent">
              grandes empresas para operar.
            </span>
          </p>
        </div>
      </div>

      <div className="pb-16 md:pb-28">
        <div ref={emblaRef} className="overflow-hidden px-6">
          <div ref={cardsRef} className="flex gap-[10px]">
            {cards.map((card, i) => (
              <article
                key={card.title}
                ref={(el) => {
                  if (el) cardEls.current[i] = el;
                }}
                className={cn(
                  "flex-none flex flex-col justify-center p-6 relative overflow-hidden",
                  "w-[calc((100vw-48px)/1.15)] aspect-[3/4]",
                  "md:w-[calc((100vw-48px)/4.3)] md:aspect-[1/1.05]",
                )}
              >
                <div className="absolute inset-0 bg-[#EEF1F0]" aria-hidden />
                <div className="relative z-10">
                  <h3 className="font-gilroy font-semibold leading-snug mb-2 text-xl text-[#1C2B2B]">
                    {card.title}
                  </h3>
                  <p className="font-notosans leading-relaxed text-base text-[#4A5E5C]">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end gap-3 mt-5 pr-6">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Ver tarjetas anteriores"
            className={cn(
              "transition-opacity duration-150",
              canPrev ? "opacity-100" : "opacity-25",
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M13 4L7 10L13 16"
                stroke="#1A1A1A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Ver tarjetas siguientes"
            className={cn(
              "transition-opacity duration-150",
              canNext ? "opacity-100" : "opacity-25",
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 4L13 10L7 16"
                stroke="#1A1A1A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
