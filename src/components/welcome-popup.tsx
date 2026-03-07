"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const options = [
  { label: "Quiero trabajar con Dinelco", href: "/contacto" },
  { label: "Ver documentación para desarrolladores", href: "/desarrolladores" },
  { label: "Ya soy cliente de Dinelco", href: "/portal" },
];

export const WelcomePopup = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-500",
        "transition-[opacity,transform] duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none",
      )}
    >
      {/* Botón X flotante fuera del card — esquina superior derecha */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar"
        className="absolute -top-10 -right-1 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-foreground hover:bg-foreground/80 transition-colors duration-150 shadow-md"
      >
        <X size={14} strokeWidth={2.5} className="text-white" aria-hidden />
      </button>

      {/* Card */}
      <div
        className="w-[320px] rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
        role="dialog"
        aria-label="Bienvenido a Dinelco"
      >
        {/* Header primary */}
        <div className="bg-primary px-5 pt-6 pb-6">
          <p className="font-gilroy font-bold text-[20px] text-white leading-snug mb-2">
            ¡Bienvenido!
          </p>
          <p className="font-notosans text-sm text-white/90 leading-relaxed">
            Parece que te interesa la red dinelco. ¿Querés hablar con un
            experto?
          </p>
        </div>

        {/* Options */}
        <div className="bg-white px-4 pt-4 pb-3 flex flex-col gap-2">
          {options.map((option) => (
            <Link
              key={option.label}
              href={option.href}
              className="w-full text-left px-4 py-3.5 rounded-md transition-colors duration-150 font-notosans text-sm text-foreground border border-label/25 hover:border-primary leading-snug"
            >
              {option.label}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white px-5 pb-5 pt-1">
          <p className="font-notosans text-[11px] text-label/60 leading-relaxed">
            Esta información puede ser transcrita, usada y almacenada por
            terceros, de acuerdo con nuestra{" "}
            <a
              href="/privacidad"
              className="underline hover:text-primary transition-colors"
            >
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
