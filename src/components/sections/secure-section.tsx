"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import pciLogo from "@/assets/licence/pci-dss-logo.svg";
import cybersourceLogo from "@/assets/licence/cybersource-logo.png";
import visaLogo from "@/assets/partners/visa.svg";
import mastercardLogo from "@/assets/partners/mastercard.svg";

export const SecureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // prefersReducedMotion: respetamos la preferencia del usuario
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="secure-heading"
      className="relative bg-[#F5F5FC] py-20 px-6 md:px-24"
    >
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* ── Texto ── */}
        <div className="w-full md:w-1/2">
          <h2
            id="secure-heading"
            className={cn(
              "font-gilroy bg-linear-to-r from-primary via-primary via-0% to-secondary bg-clip-text text-transparent text-4xl md:text-5xl leading-[1.1] font-black tracking-tight mb-6",
              "transition-[opacity,transform] duration-600 ease-out",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
            style={{ transitionDelay: "80ms" }}
          >
            Seguridad real en cada transacción
          </h2>
          <p
            className={cn(
              "font-notosans text-base md:text-lg text-label leading-relaxed mb-3",
              "transition-[opacity,transform] duration-600 ease-out",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
            style={{ transitionDelay: "160ms" }}
          >
            <strong className="font-bold text-primary">
              Cada transacción en la red dinelco está protegida bajo los más
              altos estándares de la industria.{" "}
            </strong>
            <span className="text-foreground">
              Operamos con certificaciones internacionales de seguridad,
              alineados con los requisitos de VISA y Mastercard, garantizando
              que cada pago sea confiable, sin fricciones y libre de fraudes.
            </span>
          </p>
        </div>

        {/* ── Visual derecho ── */}
        <div
          className={cn(
            "w-full md:w-1/2 flex justify-center items-center",
            "transition-[opacity,transform] duration-700 ease-out",
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
          )}
          style={{ transitionDelay: "200ms" }}
        >
          {/*
           * Contenedor del blob: usamos aspect-square + w-full con max-w
           * en vez de w/h fijos para que escale bien en mobile
           */}
          <div className="relative flex items-center justify-center w-full max-w-[420px] aspect-square">
            {/* Blob orgánico — aria-hidden, puramente decorativo */}
            <svg
              aria-hidden
              focusable="false"
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 420 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M210 30
                   C270 20, 360 60, 385 130
                   C410 200, 390 290, 340 345
                   C290 400, 200 415, 135 390
                   C70 365, 25 295, 20 220
                   C15 145, 55 70, 110 45
                   C145 30, 175 38, 210 30Z"
                fill="#EEEAFD"
                opacity="0.55"
              />
            </svg>

            {/* Badge escudo — aria-hidden, decorativo */}
            <div
              aria-hidden
              className="absolute top-[5%] right-[2%] z-20 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary shadow-xl flex items-center justify-center"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                focusable="false"
              >
                <path
                  d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25V2z"
                  fill="white"
                  opacity="0.9"
                />
                <path
                  d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>

            {/* Tarjeta de certificaciones */}
            <figure className="relative z-10 bg-white rounded-2xl shadow-md m-0">
              <figcaption className="sr-only">
                Certificaciones de seguridad: PCI DSS, CyberSource, Mastercard y
                Visa
              </figcaption>

              {/* Fila superior: PCI + CyberSource */}
              <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 md:pb-6 flex items-center gap-4">
                <Image
                  src={pciLogo}
                  alt="PCI DSS Security Standards Council"
                  height={52}
                  style={{
                    height: "clamp(40px, 5vw, 52px)",
                    width: "auto",
                    flexShrink: 0,
                  }}
                  loading="lazy"
                />
                <div aria-hidden className="w-px h-10 bg-gray-200 shrink-0" />
                <Image
                  src={cybersourceLogo}
                  alt="CyberSource by Visa"
                  width={160}
                  height={52}
                  style={{ width: "clamp(110px, 16vw, 160px)", height: "auto" }}
                  loading="lazy"
                />
              </div>

              {/* Separador con gradiente marca */}
              <div
                aria-hidden
                className="h-px mx-6 md:mx-8 bg-gradient-to-r from-primary/70 via-primary/40 to-secondary"
              />

              {/* Fila inferior: redes de pago */}
              <div className="px-6 md:px-8 py-5 md:py-6 flex items-center justify-center gap-5 md:gap-6">
                <Image
                  src={mastercardLogo}
                  alt="Mastercard"
                  height={40}
                  style={{ height: "clamp(30px, 4vw, 40px)", width: "auto" }}
                  loading="lazy"
                />
                <Image
                  src={visaLogo}
                  alt="Visa"
                  height={36}
                  style={{ height: "clamp(26px, 3.5vw, 36px)", width: "auto" }}
                  loading="lazy"
                />
              </div>

              {/* Separador inferior */}
              <div
                aria-hidden
                className="h-px mx-6 md:mx-8 bg-gradient-to-r from-primary/70 via-primary/40 to-secondary"
              />
              <div className="h-3" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
