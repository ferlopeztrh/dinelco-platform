"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

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

// Componente individual para manejar la animación de cada item
const AccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof industries)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-neutral-200">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-left text-base text-neutral-900"
      style={{ fontWeight: isOpen ? 600 : 400 }}
    >
      {item.label}
      <span
        className="text-xl text-neutral-400 inline-block transition-transform duration-300"
        style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
      >
        +
      </span>
    </button>

    <div
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows 0.35s ease",
      }}
    >
      <div style={{ minHeight: 0, overflow: "hidden" }}>
        <div className="pb-6 text-sm leading-relaxed text-neutral-500">
          <p>{item.description}</p>
          <Link
            href="#"
            className="inline-block mt-3 text-xl text-neutral-900 no-underline"
          >
            →
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export const ProductsSectionV2 = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top+=200",
      end: "bottom bottom",
      pin: textRef.current,
      pinSpacing: true,
    });
  });

  return (
    <div ref={wrapperRef}>
      {/* Bloque 1: texto */}
      <div className="h-screen px-16 pt-20">
        <div ref={textRef} className="max-w-3xl">
          <p className="text-3xl font-gilroy font-semibold leading-tight text-neutral-900">
            Diferentes industrias. Un estándar. Las empresas de todos los
            sectores confían en Dinelco para garantizar el flujo continuo de
            dinero.
          </p>
        </div>
      </div>

      {/* Bloque 2: acordeones + imagen */}
      <div className="grid grid-cols-2">
        <div
          className="flex flex-col justify-end px-16 pb-16"
          style={{ minHeight: "100vh" }}
        >
          <div className="border-t border-neutral-200">
            {industries.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>

        {/* Columna derecha: imagen sticky */}
        <div className="sticky top-0 h-screen overflow-hidden bg-neutral-900">
          <div className="w-full h-full flex items-center justify-center text-white opacity-40 font-mono text-sm">
            imagen / video aquí
          </div>
        </div>
      </div>
    </div>
  );
};
