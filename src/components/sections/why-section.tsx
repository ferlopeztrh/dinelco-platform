"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";

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

const VISIBLE_DESKTOP = 4.3;
const VISIBLE_MOBILE = 1.15;
const CARD_GAP = 10;
const SIDE_PADDING = 24; // px — igual que pl-6

export const WhySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isMobile) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 0);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [isMobile]);

  const scrollByCard = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.clientWidth / VISIBLE_DESKTOP + CARD_GAP;
    el.scrollBy({
      left: direction === "next" ? cardW : -cardW,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white z-10"
      aria-label="Por qué elegirnos"
    >
      <div className="pb-10 md:pb-16 px-6 pt-16 md:pt-28">
        <div className="max-w-3xl mx-auto">
          <p
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-gilroy font-semibold leading-[1.35] tracking-tight",
              "transition-[opacity,transform] duration-700 ease-out",
              sectionVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
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
        <div
          ref={scrollRef}
          role="region"
          aria-label="Razones para elegir Dinelco"
          className="flex gap-[10px] overflow-x-auto"
          style={{
            // proximity — snap solo cuando estás cerca del punto de snap, no en cualquier swipe
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            // Padding lateral con scroll-padding para que el snap respete el offset
            paddingLeft: SIDE_PADDING,
            paddingRight: SIDE_PADDING,
            scrollPaddingLeft: SIDE_PADDING,
          }}
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex-shrink-0 flex flex-col justify-center p-6 relative overflow-hidden"
              style={{
                scrollSnapAlign: "start",
                width: isMobile
                  ? `calc((100vw - ${SIDE_PADDING * 2}px) / ${VISIBLE_MOBILE})`
                  : `calc((100vw - ${SIDE_PADDING * 2}px) / ${VISIBLE_DESKTOP})`,
                aspectRatio: isMobile ? "3 / 4" : "1 / 1.05",
              }}
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

        {!isMobile && (
          <div className="flex items-center justify-end gap-3 mt-5 pr-6">
            <button
              onClick={() => scrollByCard("prev")}
              disabled={!canPrev}
              aria-label="Ver tarjetas anteriores"
              className={cn(
                "transition-opacity duration-200",
                canPrev ? "opacity-100" : "opacity-30",
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
              onClick={() => scrollByCard("next")}
              disabled={!canNext}
              aria-label="Ver tarjetas siguientes"
              className={cn(
                "transition-opacity duration-200",
                canNext ? "opacity-100" : "opacity-30",
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
        )}
      </div>
    </section>
  );
};
