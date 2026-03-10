"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect, useCallback } from "react";
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

const AUTOPLAY_DURATION = 10000;

const industries = [
  {
    id: "comercio",
    label: "Comercio",
    description:
      "Unifica los pagos en tienda y online. Acepta cualquier método de pago y obtén visibilidad total de tus ventas en tiempo real.",
  },
  {
    id: "hosteleria",
    label: "Hostelería y viajes",
    description:
      "Gestiona pagos en múltiples propiedades y canales. Reduce el fraude y mejora la experiencia del huésped desde la reserva hasta el check-out.",
  },
  {
    id: "medios",
    label: "Medios digitales y contenido",
    description:
      "Optimiza suscripciones y pagos recurrentes. Maximiza la retención con lógica de reintentos inteligente y tokenización de tarjetas.",
  },
  {
    id: "saas",
    label: "Plataformas SaaS y marketplaces",
    description:
      "Monetiza tu plataforma con pagos integrados. Divide pagos, gestiona onboarding de merchants y cumple con la normativa local.",
  },
  {
    id: "alimentos",
    label: "Alimentos y bebidas",
    description:
      "Integra punto de venta y pagos en el móvil. Servicio más rápido, operaciones más fluidas y visibilidad total desde el terminal TPV hasta el pago.",
  },
  {
    id: "financiero",
    label: "Servicios financieros",
    description:
      "Conecta la emisión, la adquisición y la tesorería en una sola plataforma. Diseñado para mantener el flujo de fondos y hacer crecer el negocio.",
  },
];

export const ProductsSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(AUTOPLAY_DURATION);

  const [openValue, setOpenValue] = useState("comercio");
  const currentIndex = industries.findIndex((i) => i.id === openValue);

  const startBar = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.animation = "none";
    void bar.offsetWidth; // force reflow
    bar.style.animation = `progress-bar ${remainingRef.current}ms linear forwards`;
    bar.style.animationPlayState = "running";
  }, []);

  const goToNext = useCallback(() => {
    const next = industries[(currentIndex + 1) % industries.length];
    remainingRef.current = AUTOPLAY_DURATION;
    setOpenValue(next.id);
  }, [currentIndex]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(goToNext, remainingRef.current);
    startBar();
  }, [goToNext, startBar]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
    }
    const bar = barRef.current;
    if (bar) bar.style.animationPlayState = "paused";
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const el = accordionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startTimer();
        } else {
          pauseTimer();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startTimer, pauseTimer]);

  // Cuando cambia el item — reiniciar barra y timer si es visible
  useEffect(() => {
    remainingRef.current = AUTOPLAY_DURATION;
    if (isVisibleRef.current) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [openValue, startTimer]);

  const handleValueChange = (val: string[]) => {
    if (val.length > 0) {
      const newId = val[val.length - 1];
      if (newId !== openValue) {
        remainingRef.current = AUTOPLAY_DURATION;
        setOpenValue(newId);
      }
    }
  };

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      // Pin principal
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top+=100",
        end: "bottom bottom-=50",
        pin: textRef.current,
        pinSpacing: true,
      });

      // Split + scrub
      const split = new SplitText(el, { type: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.4 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top+=75",
            end: "30% top+=75", // completa la animación en el primer 30% del scroll
            scrub: 1,
          },
        },
      );

      return () => split.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <>
      <style>{`
          @keyframes progress-bar {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
        `}</style>

      <div ref={wrapperRef} className="mb-12">
        {/* Bloque 1: texto */}
        <div className="h-[60vh] px-6 pt-20">
          <div ref={textRef} className="max-w-3xl">
            <p className="text-3xl font-gilroy font-semibold leading-tight text-black">
              Diferentes industrias. Un estándar. Las empresas de todos los
              sectores confían en Dinelco para garantizar el flujo continuo de
              dinero.
            </p>
          </div>
        </div>

        {/* Bloque 2: acordeones + imagen */}
        <div className="grid grid-cols-2">
          <div
            ref={accordionRef}
            className="flex flex-col justify-end px-6 min-h-dvh"
          >
            <Accordion
              value={[openValue]}
              onValueChange={handleValueChange}
              className="w-full"
            >
              {industries.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="relative border-t border-neutral-200 last:border-b"
                >
                  <AccordionTrigger
                    className={cn(
                      "font-gilroy font-semibold text-xl text-black py-6 cursor-pointer transition-opacity duration-200",
                      item.id !== openValue && "opacity-70",
                    )}
                  >
                    {item.label}
                  </AccordionTrigger>

                  <AccordionContent>
                    <p className="text-base font-notosans max-w-3xl leading-relaxed text-black/75 mb-3">
                      {item.description}
                    </p>
                    <Link
                      href="#"
                      className="inline-flex items-center gap-1.5 text-base font-gilroy font-medium text-black no-underline hover:gap-2.5 transition-all duration-200"
                    >
                      Ver más <ArrowRight className="w-4 h-4" />
                    </Link>
                  </AccordionContent>

                  {item.id === openValue && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-[2px] overflow-hidden">
                      <div
                        ref={barRef}
                        className="h-full bg-primary origin-left"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Columna derecha: imagen sticky */}
          <div className="sticky top-0 h-screen overflow-hidden bg-black">
            <div className="w-full h-full flex items-center justify-center text-white opacity-40 font-mono text-sm">
              imagen / video aquí
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
