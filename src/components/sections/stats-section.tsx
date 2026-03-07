"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import backgroundD from "@/assets/patterns/background-d.png";

const stats = [
  {
    value: "+371.146",
    label: "POS instalados en todo el país",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: "+604",
    label: "Cajeros automáticos operativos",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h2m0 0v8m0-8h2M15 8h2v4h-2v4" />
      </svg>
    ),
  },
  {
    value: "+363.688",
    label: "Comercios adheridos a la red",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    value: "99.9%",
    label: "Tiempo de actividad histórico",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      aria-labelledby="stats-heading"
      className="relative overflow-hidden py-6"
    >
      <h2 id="stats-heading" className="sr-only">
        Dinelco en números
      </h2>

      {/* Fondo fijo */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundD.src})`,
            backgroundAttachment: "fixed",
            backgroundRepeat: "repeat",
            backgroundSize: "1400px",
            backgroundPosition: "center top",
          }}
        />
      </div>

      <div className="relative mx-auto md:max-w-400 max-w-full px-6 md:px-16">
        {/* Texto encima de las cards, sobre el fondo púrpura */}
        <p className="font-gilroy font-black text-white text-3xl mb-4">
          La red dinelco en números
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ value, label, icon }, i) => (
            <div
              key={label}
              className={cn(
                "bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-lg",
                "transition-[opacity,transform] duration-600 ease-out",
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                {icon}
              </div>
              <div>
                <dt className="sr-only">{label}</dt>
                <dd
                  className="text-4xl md:text-5xl font-gilroy font-bold text-foreground leading-none mb-2"
                  aria-label={`${value} — ${label}`}
                >
                  {value}
                </dd>
                <p
                  className="text-base font-semibold text-label font-notosans leading-snug"
                  aria-hidden
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
