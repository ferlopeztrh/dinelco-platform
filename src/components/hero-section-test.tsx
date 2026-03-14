"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Noise from "@/components/ui/noise-background";
import { SlideTextButton } from "@/components/ui/slide-text-button";
import { TrustedBrands } from "./trusted-brands";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { DinelcoLogoSvg } from "@/components/icons/dinelco-logo.svg";

gsap.registerPlugin(ScrollTrigger);

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

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const curtainBgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const userPausedRef = useRef(false);
  const curtainUpRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [curtainUp, setCurtainUp] = useState(false);
  const isMobile = useIsMobile();

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

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPausedRef.current) {
            video.play().catch(() => {});
            setPlaying(true);
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0 && !curtainUpRef.current) {
        e.preventDefault();
        curtainUpRef.current = true;
        isAnimatingRef.current = true;
        setCurtainUp(true);

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });

        tl.to(
          curtainBgRef.current,
          {
            yPercent: -100,
            duration: 0.8,
            ease: "expo.inOut",
          },
          0,
        )
          .to(
            contentRef.current,
            {
              y: "15dvh",
              duration: 0.8,
              ease: "expo.inOut",
            },
            0,
          )
          .to(
            logoRef.current,
            {
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
            },
            0,
          );
      } else if (e.deltaY < 0 && curtainUpRef.current && window.scrollY === 0) {
        e.preventDefault();
        curtainUpRef.current = false;
        isAnimatingRef.current = true;
        setCurtainUp(false);

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });

        tl.to(
          curtainBgRef.current,
          {
            yPercent: 0,
            duration: 0.8,
            ease: "expo.inOut",
          },
          0,
        )
          .to(
            contentRef.current,
            {
              y: 0,
              duration: 0.8,
              ease: "expo.inOut",
            },
            0,
          )
          .to(
            logoRef.current,
            {
              opacity: 1,
              duration: 0.4,
              ease: "power1.out",
              delay: 0.2,
            },
            0,
          );
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useGSAP(
    () => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;

      if (isMobile) {
        if (wrapperRef.current)
          gsap.set(wrapperRef.current, { clearProps: "scale,borderRadius" });
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
      aria-label="Hero — Una fintech en la que podés confiar"
      className="relative w-full bg-background"
      style={{ minHeight: "calc(100vh + 80px)" }}
    >
      <div
        ref={wrapperRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100dvh",
          transformOrigin: "center top",
          willChange: "transform",
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            clipPath: "inset(8% 0 8% 0 round 24px)", // ← round en el clipPath
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
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-black/50"
          style={{ zIndex: 1 }}
          aria-hidden
        />

        <div style={{ zIndex: 2, position: "absolute", inset: 0 }} aria-hidden>
          <Noise patternAlpha={14} patternRefreshInterval={2} />
        </div>

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

        {/* Curtain BG — solo el fondo que sube */}
        <div
          ref={curtainBgRef}
          className="absolute inset-x-0 top-0 z-[5] bg-primary"
          style={{ height: "75%", borderRadius: "0 0 24px 24px" }}
        />

        {/* Contenido — arranca en top del curtain, se mueve al centro del hero */}
        <div
          ref={contentRef}
          className="absolute inset-x-0 z-[6] flex flex-col justify-center items-center text-center px-6"
          style={{ top: 0, height: "70%" }}
        >
          <div className="w-full max-w-5xl mx-auto">
            <div ref={logoRef} className="mb-16 flex justify-center">
              <DinelcoLogoSvg variant="white" className="h-18 w-auto" />
            </div>

            <h1 className="font-gilroy font-semibold text-white leading-[1.1] tracking-tight text-[32px]">
              Una fintech en la que podés confiar.
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto font-notosans font-semibold leading-relaxed tracking-wide">
              Elegir la red dinelco es estar un paso adelante, es hacerlo
              diferente. Es no conformarte y buscar algo mejor. Pagos, datos y
              productos financieros para los negocios que eligen crecer.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <SlideTextButton
                as="link"
                href="/primeros-pasos"
                label="Primeros pasos"
                className={`inline-block px-6 py-3 rounded-md text-[15px] mx-0 transition-colors duration-300 ${
                  curtainUp ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              />
              <SlideTextButton
                as="link"
                href="/contacto"
                label="Hablá con un especialista"
                className="inline-block px-6 py-3 rounded-md text-[15px] border border-white/40 text-white mx-0"
              />
            </div>
          </div>
        </div>
      </div>

      <TrustedBrands />
    </section>
  );
}
