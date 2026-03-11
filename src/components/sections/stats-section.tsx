"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const stats = [
  { label: "Procesado mensualmente", value: "Más de 2.000.000" },
  { label: "Comercios adheridos", value: "Más de 389.687" },
  { label: "POS instalados", value: "Más de 397.217" },
  { label: "Cajeros Automáticos", value: "Más de 604" },
  { label: "Tiempo de actividad", value: "99,99 %" },
];

export const StatsSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statRowsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 640px)", () => {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top+=120",
          end: "bottom bottom+=250",
          pin: el,
          pinSpacing: false,
          toggleActions: "play pause resume pause",
        });

        const gradientSpan = el.querySelector<HTMLElement>("[data-gradient]");
        const placeholder = document.createComment("gradient-placeholder");
        gradientSpan?.parentNode?.replaceChild(placeholder, gradientSpan!);

        const split = new SplitText(el, { type: "words" });
        placeholder.parentNode?.replaceChild(gradientSpan!, placeholder);

        const targets = [...split.words, gradientSpan].filter(Boolean);

        gsap.fromTo(
          targets,
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
            },
          },
        );

        return () => split.revert();
      });

      // Reveal stats — todos los breakpoints
      statRowsRef.current.forEach((row) => {
        if (!row) return;

        const targets = row.querySelectorAll<HTMLElement>("[data-stat-text]");
        targets.forEach((target) => {
          const split = new SplitText(target, { type: "lines" });
          gsap.set(split.lines, { y: 60 });

          ScrollTrigger.create({
            trigger: row,
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.to(split.lines, {
                y: 0,
                duration: 1,
                stagger: 0.08,
                ease: "power3.out",
              });
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className="relative pt-20 sm:pt-40 mb-60">
      {/* Texto pinneado */}
      <div className="px-4 sm:px-6 pt-12 sm:pt-20 mb-8 sm:mb-0 sm:h-[60vh]">
        <div ref={textRef} className="max-w-3xl">
          <p className="text-2xl sm:text-3xl font-gilroy font-semibold leading-tight text-black">
            Experiencia local. Confiabilidad probada. Impulsado por{" "}
            <span
              data-gradient=""
              className="font-black bg-linear-to-r from-primary via-primary via-0% to-primary bg-clip-text text-transparent"
            >
              miles de millones en datos de transacciones procesadas.
            </span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            ref={(el) => {
              if (el) statRowsRef.current[i] = el;
            }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-neutral-200 py-6 sm:py-8 last:border-b gap-1 sm:gap-0"
          >
            <span
              data-stat-text
              className="text-xs font-gilroy font-bold uppercase tracking-widest text-secondary w-32 sm:w-48 shrink-0 overflow-hidden"
            >
              {stat.label}
            </span>
            <span
              data-stat-text
              className="text-left sm:text-right font-gilroy font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black leading-none overflow-hidden"
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
