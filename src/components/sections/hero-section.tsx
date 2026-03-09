"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Noise from "@/components/ui/noise-background";
import { SlideTextButton } from "@/components/ui/slide-text-button";
import { TrustedBrands } from "../trusted-brands";
import { useIsMobile } from "@/hooks/use-is-mobile";

gsap.registerPlugin(ScrollTrigger);

export function HeroSectionV2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [playing, setPlaying] = useState(true);
  const isMobile = useIsMobile();

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  useGSAP(
    () => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;

      if (isMobile) {
        if (wrapperRef.current) {
          wrapperRef.current.style.scale = "";
          wrapperRef.current.style.borderRadius = "";
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
          height: "100vh",
          transformOrigin: "center top",
          willChange: "transform",
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            clipPath: "inset(8% 0 8% 0)",
            transform: "scale(1.2)",
            willChange: "transform",
          }}
          src="/assets/hacelo-diferente-v2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />

        <div
          className="absolute inset-0 bg-black/50"
          style={{ zIndex: 1 }}
          aria-hidden
        />

        <div style={{ zIndex: 2, position: "absolute", inset: 0 }} aria-hidden>
          <Noise patternAlpha={14} patternRefreshInterval={2} />
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ zIndex: 3 }}
        >
          <h1
            className="font-gilroy font-semibold text-white leading-[1.05] tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
          >
            Una fintech en la que podés confiar.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg font-notosans leading-relaxed">
            Pagos, datos y productos financieros para los negocios que eligen
            crecer.
          </p>
          <div className="mt-7">
            <SlideTextButton
              as="link"
              href="/primeros-pasos"
              label="Primeros pasos"
              className="px-4 py-4 rounded-full text-[15px] bg-primary w-full"
            />
          </div>
        </div>

        <button
          onClick={toggle}
          aria-label={
            playing ? "Pausar video de fondo" : "Reproducir video de fondo"
          }
          className="absolute bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors duration-200"
          style={{ zIndex: 4 }}
        >
          {playing ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <rect x="1" y="1" width="4" height="12" rx="1.5" fill="white" />
              <rect x="9" y="1" width="4" height="12" rx="1.5" fill="white" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path d="M2 1.5L12.5 7L2 12.5V1.5Z" fill="white" />
            </svg>
          )}
        </button>

        {/* TrustedBrands dentro del sticky — necesario para que MobileCarousel
            con absolute bottom-5 quede sobre el video. DesktopBrands usa
            position: fixed así que no le afecta estar aquí. */}
        <TrustedBrands />
      </div>
    </section>
  );
}
