"use client";

import { useRef, useEffect } from "react";
import backgroundD from "@/assets/patterns/background-d.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function parseStatValue(val: string) {
  const prefix = val.startsWith("+") ? "+" : "";
  const clean = val.replace("+", "").replace("%", "");
  const suffix = val.endsWith("%") ? "%" : "";
  const hasDot = clean.includes(".");
  const number = parseFloat(clean.replace(/\./g, "").replace(",", "."));
  return { prefix, number, suffix, hasDot, raw: val };
}

function formatNumber(n: number, hasDot: boolean) {
  if (!hasDot) return String(Math.round(n));
  return Math.round(n).toLocaleString("es-PY").replace(/,/g, ".");
}

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
  const numberEls = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nums = numberEls.current.filter(Boolean);
    const sts: ReturnType<typeof ScrollTrigger.create>[] = [];

    nums.forEach((el, i) => {
      const parsed = parseStatValue(stats[i]!.value);
      el.textContent = `${parsed.prefix}0${parsed.suffix}`;

      sts.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: parsed.number,
              duration: 2,
              ease: "power2.out",
              delay: i * 0.1,
              onUpdate() {
                el.textContent = `${parsed.prefix}${formatNumber(obj.val, parsed.hasDot)}${parsed.suffix}`;
              },
              onComplete() {
                el.textContent = parsed.raw;
              },
            });
          },
        }),
      );
    });

    return () => sts.forEach((st) => st.kill());
  }, []);

  return (
    <section
      aria-labelledby="stats-heading"
      className="relative overflow-hidden py-6"
    >
      <h2 id="stats-heading" className="sr-only">
        Dinelco en números
      </h2>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `url(${backgroundD.src})`,
          backgroundRepeat: "repeat",
          backgroundSize: "1400px",
          backgroundPosition: "center top",
        }}
      />

      <div className="relative mx-auto md:max-w-400 max-w-full px-6 md:px-16">
        <p className="font-gilroy font-black text-white text-3xl mb-4">
          La red dinelco en números
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ value, label, icon }, i) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                {icon}
              </div>
              <div>
                <dt className="sr-only">{label}</dt>
                <dd aria-label={`${value} — ${label}`}>
                  <span
                    ref={(el) => {
                      if (el) numberEls.current[i] = el;
                    }}
                    className="text-4xl md:text-5xl font-gilroy font-bold text-foreground leading-none block mb-2 tabular-nums"
                  >
                    {value}
                  </span>
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
