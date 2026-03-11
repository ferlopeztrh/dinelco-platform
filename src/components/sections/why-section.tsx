"use client";

import { cn } from "@/lib/utils";
import { useSplitText } from "@/hooks/use-split-text";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const cards = [
  {
    title: "Cumplimiento normativo en el que podés confiar.",
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
] as const;

export const WhySection = () => {
  const titleRef = useSplitText<HTMLHeadingElement>({
    splitType: "lines",
    duration: 0.75,
    stagger: 0.08,
    ease: "power3.out",
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
    once: true,
    threshold: 0.15,
  });

  return (
    <section className="relative bg-white z-10" aria-label="Por qué elegirnos">
      <div className="pb-10 md:pb-16 px-6 pt-16 md:pt-28">
        <div className="max-w-3xl mx-auto">
          <h2
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl font-gilroy font-semibold leading-[1.35] tracking-tight"
          >
            Tomá el control de tu negocio. La red dinelco ofrece el control, la
            fiabilidad y la infraestructura de pagos en la confían las{" "}
            <strong className="font-black bg-linear-to-r from-primary via-primary via-0% to-primary bg-clip-text text-transparent">
              grandes empresas para operar.
            </strong>
          </h2>
        </div>
      </div>

      <div className="pb-16 md:pb-28">
        <Carousel
          opts={{
            align: "center",
            dragFree: false, // scroll libre sin snap — se siente fluido en desktop
          }}
          // pl-6 en el Carousel para que el padding izquierdo funcione igual
          className="w-full"
          aria-label="Características principales"
        >
          <CarouselContent className="-ml-2.5 px-6">
            {cards.map((card) => (
              <CarouselItem
                key={card.title}
                // basis controla el ancho — mismo cálculo que antes
                className="pl-2.5 basis-[calc((100vw-48px)/1.15)] md:basis-[calc((100vw-48px)/4.3)]"
              >
                <div
                  className={cn(
                    "flex flex-col justify-center p-6 relative overflow-hidden h-full",
                    "aspect-[3/4] md:aspect-[1/1.05]",
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/*
           * CarouselPrevious / CarouselNext — solo desktop.
           * shadcn los posiciona absolute por defecto, los reubicamos
           * con un wrapper flex alineado a la derecha igual que antes.
           */}
          <div
            className="hidden md:flex items-center justify-end gap-3 mt-5 pr-6"
            role="group"
            aria-label="Controles del carrusel"
          >
            <CarouselPrevious
              className={cn(
                // resetear el posicionamiento absolute de shadcn
                "static translate-x-0 translate-y-0",
                "w-8 h-8 rounded-none border-none shadow-none bg-transparent",
                "hover:bg-transparent [&_svg]:w-5 [&_svg]:h-5",
              )}
              aria-label="Ver tarjetas anteriores"
            />
            <CarouselNext
              className={cn(
                "static translate-x-0 translate-y-0",
                "w-8 h-8 rounded-none border-none shadow-none bg-transparent",
                "hover:bg-transparent [&_svg]:w-5 [&_svg]:h-5",
              )}
              aria-label="Ver tarjetas siguientes"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
