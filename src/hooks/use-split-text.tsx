"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface UseSplitTextOptions {
  splitType?: "chars" | "words" | "lines" | "words, chars";
  duration?: number;
  stagger?: number;
  ease?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  once?: boolean;
}

export function useSplitText<T extends HTMLElement>(
  options: UseSplitTextOptions = {},
) {
  const {
    splitType = "words",
    duration = 0.7,
    stagger = 0.03,
    ease = "power3.out",
    from = { opacity: 0, y: 32 },
    to = { opacity: 1, y: 0 },
    threshold = 0.15,
    once = false,
  } = options;

  const ref = useRef<T>(null);

  // Guardamos las opciones en un ref para que el useEffect no necesite
  // declararlas como dependencias — son estáticas en todos los usos actuales
  // y recrear el SplitText + ScrollTrigger en cada render sería costoso.
  const optsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Flag para detectar desmontaje antes de que fonts.ready resuelva
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const init = (): (() => void) => {
      const {
        splitType = "words",
        duration = 0.7,
        stagger = 0.03,
        ease = "power3.out",
        from = { opacity: 0, y: 32 },
        to = { opacity: 1, y: 0 },
        threshold = 0.15,
        once = false,
      } = optsRef.current;

      const wrappers: HTMLElement[] = [];
      let targets: Element[] = [];

      // Guardamos la instancia del ST creado en este scope — no usamos
      // ScrollTrigger.getAll() para no iterar los triggers de otras secciones
      let st: ScrollTrigger | null = null;

      const split = new SplitText(el, {
        type: splitType,
        wordsClass: "st-word",
        charsClass: "st-char",
        linesClass: "st-line",
        onSplit(self) {
          const isLines = splitType === "lines" || splitType.includes("lines");

          if (isLines && self.lines?.length) {
            self.lines.forEach((line) => {
              const wrapper = document.createElement("div");
              wrapper.style.overflow = "hidden";
              wrapper.style.display = "block";
              line.parentNode?.insertBefore(wrapper, line);
              wrapper.appendChild(line);
              wrappers.push(wrapper);
            });
            targets = self.lines;
          } else if (splitType.includes("chars") && self.chars?.length) {
            targets = self.chars;
          } else if (splitType.includes("words") && self.words?.length) {
            targets = self.words;
          }

          if (!targets.length)
            targets = self.chars || self.words || self.lines || [];

          gsap.set(targets, { ...from });

          if (once) {
            st = ScrollTrigger.create({
              trigger: el,
              start: `top ${(1 - threshold) * 100}%`,
              once: true,
              onEnter: () => {
                gsap.killTweensOf(targets);
                gsap.fromTo(
                  targets,
                  { ...from },
                  {
                    ...to,
                    duration,
                    ease,
                    stagger: { each: stagger, from: "start" },
                  },
                );
              },
            });
          } else {
            st = ScrollTrigger.create({
              trigger: el,
              start: `top ${(1 - threshold) * 100}%`,
              end: "bottom 10%",
              onEnter: () => {
                gsap.killTweensOf(targets);
                gsap.fromTo(
                  targets,
                  { ...from },
                  {
                    ...to,
                    duration,
                    ease,
                    stagger: { each: stagger, from: "start" },
                  },
                );
              },
              onLeave: () => {
                gsap.killTweensOf(targets);
                gsap.to(targets, {
                  ...from,
                  y: typeof from.y === "number" ? -Math.abs(from.y) : from.y,
                  duration: duration * 0.6,
                  ease: "power2.in",
                  stagger: { each: stagger * 0.5, from: "end" },
                });
              },
              onEnterBack: () => {
                gsap.killTweensOf(targets);
                gsap.fromTo(
                  targets,
                  {
                    ...from,
                    y: typeof from.y === "number" ? -Math.abs(from.y) : from.y,
                  },
                  {
                    ...to,
                    duration,
                    ease,
                    stagger: { each: stagger, from: "end" },
                  },
                );
              },
              onLeaveBack: () => {
                gsap.killTweensOf(targets);
                gsap.to(targets, {
                  ...from,
                  duration: duration * 0.6,
                  ease: "power2.in",
                  stagger: { each: stagger * 0.5, from: "start" },
                });
              },
            });
          }
        },
      });

      return () => {
        // Matar solo el ST de esta instancia — no toca los de otras secciones
        st?.kill();
        st = null;
        gsap.killTweensOf(targets);
        // Limpiar wrappers antes de revert para no dejar divs huérfanos
        wrappers.forEach((w) => {
          const child = w.firstChild;
          if (child) w.parentNode?.insertBefore(child, w);
          w.parentNode?.removeChild(w);
        });
        split.revert();
      };
    };

    if (document.fonts.status === "loaded") {
      cleanup = init();
    } else {
      document.fonts.ready.then(() => {
        // Si el componente se desmontó mientras esperábamos las fuentes,
        // no inicializamos nada — evita operar sobre un elemento huérfano
        if (!cancelled) cleanup = init();
      });
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
  // Las opciones van en optsRef — no necesitan ser dependencias del effect

  return ref;
}
