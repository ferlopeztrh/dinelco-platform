"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import portalImage from "@/assets/products/portal-comercios.png";
import { useSplitText } from "@/hooks/use-split-text";

gsap.registerPlugin(ScrollTrigger, SplitText);

const items = [
  "Accedé a información detallada y en línea de todas las transacciones realizadas en tu negocio.",
  "Monitoreá tus ventas por sucursal y/o producto y accedé a tus facturas.",
  "Solicitá soporte técnico, accesorios o chateá con nuestro centro de atención.",
  "* Beneficio para todos los comercios afiliados a la red dinelco.",
];

export const PortalComerciosSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);

  // Título: cajón yPercent — pero tiene bg-clip-text, usar useSplitText con opacity+y
  // El span gradiente no se puede splitear, pero el h3 completo sí (es una sola línea)
  // Para seguridad animamos el h3 entero como bloque
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 32 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      once: true,
      onEnter: () =>
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }),
    });
    return () => st.kill();
  }, []);

  // Párrafos: cajón yPercent por líneas
  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;
    const cleanups: (() => void)[] = [];

    const init = () => {
      els.forEach((el, i) => {
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "line-inner",
        });
        split.lines.forEach((line) => {
          const mask = document.createElement("div");
          mask.style.cssText = "overflow:hidden;display:block;";
          line.parentNode?.insertBefore(mask, line);
          mask.appendChild(line);
        });
        gsap.set(split.lines, { yPercent: 105 });
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(split.lines, {
              yPercent: 0,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.08,
              delay: i * 0.1,
            }),
        });
        cleanups.push(() => {
          st.kill();
          split.lines.forEach((line) => {
            const mask = line.parentElement;
            if (mask && mask !== el) {
              mask.parentNode?.insertBefore(line, mask);
              mask.parentNode?.removeChild(mask);
            }
          });
          split.revert();
        });
      });
    };

    if (document.fonts.status === "loaded") {
      init();
    } else {
      document.fonts.ready.then(init);
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="relative mt-12 px-6 md:px-48">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        <div className="w-full md:w-1/2 shrink-0">
          <Image
            src={portalImage}
            alt="Pantalla del Portal de Comercios Dinelco en laptop y móvil"
            className="w-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-1/2 text-left">
          <h3
            ref={titleRef}
            className="text-4xl md:text-5xl font-gilroy font-black leading-[1.35] tracking-tight mb-8 bg-gradient-to-r from-primary via-0% to-secondary bg-clip-text text-transparent"
          >
            Portal de comercios
          </h3>
          <ul
            aria-label="Funcionalidades del Portal de Comercios"
            className="flex flex-col gap-5 max-w-2xl mx-auto md:mx-0 list-none p-0"
          >
            {items.map((text, i) => (
              <li
                key={i}
                ref={(el) => {
                  if (el) itemRefs.current[i] = el;
                }}
                className={
                  i === items.length - 1
                    ? "font-gilroy font-semibold text-sm text-secondary mt-3"
                    : "font-notosans text-base font-bold md:text-lg text-label leading-relaxed"
                }
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
