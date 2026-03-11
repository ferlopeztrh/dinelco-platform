"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Noise from "@/components/ui/noise-background";
import { SlideTextButton } from "@/components/ui/slide-text-button";
import { TrustedBrands } from "../trusted-brands";
import { useIsMobile } from "@/hooks/use-is-mobile";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// SVG icons extraídos como constantes — evita recrear JSX en cada render
// ─────────────────────────────────────────────────────────────────────────────
const PauseIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    focusable="false"
  >
    <rect x="1" y="1" width="4" height="12" rx="1.5" fill="white" />
    <rect x="9" y="1" width="4" height="12" rx="1.5" fill="white" />
  </svg>
);

const PlayIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    focusable="false"
  >
    <path d="M2 1.5L12.5 7L2 12.5V1.5Z" fill="white" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
export function HeroSectionV2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  // userPausedRef: distingue pausa manual vs pausa por viewport
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const isMobile = useIsMobile();

  // useCallback — referencia estable, no se recrea en cada render
  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      userPausedRef.current = true;
      video.pause();
      setPlaying(false);
    }
  }, []);

  // Pausar video cuando el hero sale del viewport — libera GPU/CPU
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Solo reanudar si el usuario NO lo pausó manualmente
          if (!userPausedRef.current) {
            video.play().catch(() => {});
            setPlaying(true);
          }
        } else {
          video.pause();
          // No marcamos userPaused — fue el sistema, no el usuario
        }
      },
      { threshold: 0.05 },
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []); // sin dependencias — refs son estables

  // GSAP scroll scale — solo desktop
  useGSAP(
    () => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;

      if (isMobile) {
        if (wrapperRef.current) {
          gsap.set(wrapperRef.current, { clearProps: "scale,borderRadius" });
        }
        return;
      }
      if (!wrapperRef.current || !sectionRef.current) return;

      const tween = gsap.to(wrapperRef.current, {
        scale: 0.98,
        borderRadius: 2,
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=600",
          scrub: 1,
          // invalidateOnRefresh: true — recalcula si el layout cambia
          invalidateOnRefresh: true,
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger ?? null;
    },
    { scope: sectionRef, dependencies: [isMobile] },
  );

  return (
    <section
      ref={sectionRef}
      data-hero
      // role="banner" es implícito en <header>, pero para <section> lo aclaramos
      aria-label="Hero — Una fintech en la que podés confiar"
      className="relative w-full bg-background"
      style={{ minHeight: "calc(100vh + 80px)" }}
    >
      <div
        ref={wrapperRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100dvh", // dvh > vh en mobile — evita el salto de barra del browser
          transformOrigin: "center top",
          willChange: "transform",
        }}
      >
        {/*
         * VIDEO — optimizaciones LCP / performance:
         * - preload="metadata": carga solo el primer frame, no "none"
         *   "none" causa un flash negro visible hasta que el usuario hace scroll
         * - fetchpriority="low": no compite con fuentes/CSS críticos
         * - El poster= es clave para LCP — debe ser una imagen AVIF/WebP
         *   del primer frame del video, comprimida a <20 KB
         */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            // clipPath + scale dan el efecto de "ventana" actual —
            // GPU-composited, no dispara layout
            clipPath: "inset(8% 0 8% 0)",
            transform: "scale(1.2)",
            willChange: "transform",
          }}
          src="/assets/hacelo-diferente-v2.mp4"
          poster="/assets/hacelo-diferente-poster.avif"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          // fetchpriority no está en los tipos de React pero es válido como attr
          // @ts-expect-error — fetchpriority es un atributo HTML5 válido
          fetchpriority="low"
          aria-hidden="true"
        />

        {/* Overlay oscuro — sin willChange, es estático */}
        <div
          className="absolute inset-0 bg-black/50"
          style={{ zIndex: 1 }}
          aria-hidden
        />

        {/* Noise — zIndex 2 */}
        <div style={{ zIndex: 2, position: "absolute", inset: 0 }} aria-hidden>
          <Noise patternAlpha={14} patternRefreshInterval={2} />
        </div>

        {/* Contenido — zIndex 3 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ zIndex: 3 }}
        >
          {/*
           * H1 semántico: única H1 de la página.
           * El texto debe coincidir con el <title> de metadata para coherencia SEO.
           */}
          <h1 className="font-gilroy font-semibold text-white leading-[1.1] tracking-tight text-[32px]">
            Una fintech en la que podés confiar.
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-xl font-notosans font-semibold leading-relaxed tracking-wide">
            Elegir la red dinelco es estar un paso adelante, es hacerlo
            diferente. Es no conformarte y buscar algo mejor. Pagos, datos y
            productos financieros para los negocios que eligen crecer.
          </p>

          <div className="mt-10">
            <SlideTextButton
              as="link"
              href="/primeros-pasos"
              label="Primeros pasos"
              className="inline-block px-6 py-3 rounded-md text-[15px] bg-primary mx-1"
            />
          </div>
        </div>

        {/*
         * Botón play/pause — zIndex 4
         * - type="button" explícito (evita submit en forms ancestros)
         * - aria-pressed comunica el estado toggle a screen readers
         */}
        <button
          type="button"
          onClick={toggle}
          aria-label={
            playing ? "Pausar video de fondo" : "Reproducir video de fondo"
          }
          aria-pressed={!playing}
          className="absolute bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors duration-200"
          style={{ zIndex: 4 }}
        >
          {playing ? PauseIcon : PlayIcon}
        </button>
      </div>

      <TrustedBrands />
    </section>
  );
}
