"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/use-is-mobile";

import visaLogo from "@/assets/partners/visa.svg";
import mastercardLogo from "@/assets/partners/mastercard.svg";
import bepsaLogo from "@/assets/partners/bepsa.svg";
import googlePayLogo from "@/assets/partners/google-pay.svg";
import applePayLogo from "@/assets/partners/apple-pay.svg";
import cybersourceLogo from "@/assets/partners/cybersource.svg";
import clickToPayLogo from "@/assets/partners/click-to-pay.svg";
import pixLogo from "@/assets/partners/pix.svg";
import garminPayLogo from "@/assets/partners/garmin-pay.svg";
import cabalLogo from "@/assets/partners/cabal.svg";

type Partner = { name: string; logo: any; scale: number };

const groups: Partner[][] = [
  [
    { name: "Visa", logo: visaLogo, scale: 1 },
    { name: "Mastercard", logo: mastercardLogo, scale: 1 },
    { name: "BEPSA", logo: bepsaLogo, scale: 0.8 },
    { name: "Google Pay", logo: googlePayLogo, scale: 1.5 },
    { name: "Apple Pay", logo: applePayLogo, scale: 1.5 },
  ],
  [
    { name: "CyberSource", logo: cybersourceLogo, scale: 1 },
    { name: "Click to Pay", logo: clickToPayLogo, scale: 1.5 },
    { name: "Pix", logo: pixLogo, scale: 0.75 },
    { name: "Garmin Pay", logo: garminPayLogo, scale: 1.5 },
    { name: "Cabal", logo: cabalLogo, scale: 1 },
  ],
];

const allPartners = [...groups[0]!, ...groups[1]!];

const SLOT_W = 120;
const SLOT_H = 44;
const DURATION = 1.125;
const STAGGER = 0.08;
const PAUSE = 3;
const EASE = "power4.inOut";
const COLOR_LIMIT = 40;
const STICKY_LIMIT = 80;
const BOTTOM_OFFSET = 20;

// Delay coordinado con el header (0.4s) + su duración (0.7s)
const REVEAL_DELAY = 0.4;

function logoSrc(logo: any): string {
  return typeof logo === "string" ? logo : (logo as { src: string }).src;
}

function setImg(el: HTMLDivElement, partner: Partner) {
  const img = el.querySelector("img") as HTMLImageElement;
  img.src = logoSrc(partner.logo);
  img.alt = partner.name;
  img.style.maxWidth = `${SLOT_W * partner.scale}px`;
  img.style.maxHeight = `${SLOT_H * partner.scale}px`;
}

// ─── Mobile: marquee CSS puro ─────────────────────────────────────
const MobileCarousel = () => (
  <div
    className="absolute bottom-25 left-0 right-0 z-10 overflow-hidden"
    aria-label="Marcas asociadas"
    role="region"
    style={{
      maskImage:
        "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
    }}
  >
    <style>{`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .tb-marquee { animation: marquee 18s linear infinite; }
      @media (prefers-reduced-motion: reduce) { .tb-marquee { animation: none; } }
    `}</style>
    <div
      className="tb-marquee flex items-center gap-10"
      style={{ width: "max-content" }}
      aria-hidden
    >
      {[...allPartners, ...allPartners].map((partner, i) => (
        <div
          key={i}
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: 100, height: 40 }}
        >
          <Image
            src={partner.logo}
            alt=""
            width={160}
            height={60}
            style={{
              maxWidth: 100 * partner.scale,
              maxHeight: 40 * partner.scale,
              width: "auto",
              height: "auto",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

// ─── Desktop ──────────────────────────────────────────────────────
const DesktopBrands = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<HTMLDivElement[]>([]);
  const layers = useRef<Array<[HTMLDivElement, HTMLDivElement]>>([]);
  const activeLayer = useRef<number[]>([0, 0, 0, 0, 0]);
  const groupIndex = useRef(0);
  const isWhite = useRef(true);
  const isFixed = useRef(true);

  // Scroll: sticky vs absolute + color
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const heroSection = el.closest("[data-hero]") as HTMLElement | null;

    const setFixed = () => {
      isFixed.current = true;
      el.style.position = "fixed";
      el.style.top = "auto";
      el.style.bottom = `${BOTTOM_OFFSET}px`;
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
    };

    const setAbsolute = (scrollY: number) => {
      isFixed.current = false;
      const heroTop = heroSection
        ? heroSection.getBoundingClientRect().top + scrollY
        : 0;
      const heroHeight = heroSection
        ? heroSection.offsetHeight
        : window.innerHeight;
      const top = heroTop + heroHeight - el.offsetHeight - BOTTOM_OFFSET;
      el.style.position = "absolute";
      el.style.top = `${top}px`;
      el.style.bottom = "auto";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
    };

    const applyState = (scrollY: number) => {
      const shouldBeWhite = scrollY < COLOR_LIMIT;
      if (shouldBeWhite !== isWhite.current) {
        isWhite.current = shouldBeWhite;
        el.style.filter = shouldBeWhite
          ? "brightness(0) invert(1)"
          : "brightness(1) invert(0)";
      }
      const heroBottom = heroSection
        ? heroSection.getBoundingClientRect().bottom
        : window.innerHeight - scrollY;
      if (heroBottom <= 0) {
        if (isFixed.current) setAbsolute(scrollY);
        return;
      }
      const shouldBeFixed = scrollY < STICKY_LIMIT;
      if (shouldBeFixed !== isFixed.current) {
        shouldBeFixed ? setFixed() : setAbsolute(scrollY);
      }
    };

    applyState(window.scrollY);
    const onScroll = () => applyState(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal inicial + cycling
  useEffect(() => {
    const slots = slotsRef.current;
    if (!slots.length) return;

    // Estado inicial: invisible
    gsap.set(slots, { yPercent: 120, opacity: 0 });

    // Layer B también invisible para el cycling
    layers.current.forEach(([, b]) =>
      gsap.set(b, { yPercent: 110, opacity: 0 }),
    );

    // Reveal — cada slot entra desde abajo con stagger
    // Delay coordinado para que entre después del header
    const reveal = gsap.to(slots, {
      yPercent: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.07,
      delay: REVEAL_DELAY,
      // Cuando termina el reveal, arranca el cycling
      onComplete: () => gsap.delayedCall(PAUSE, cycle),
    });

    function cycle() {
      const nextGroupIdx = (groupIndex.current + 1) % groups.length;
      const nextGroup = groups[nextGroupIdx]!;

      const tl = gsap.timeline({
        onComplete() {
          activeLayer.current = activeLayer.current.map((a) => 1 - a);
          groupIndex.current = nextGroupIdx;
          const afterNextGroup = groups[(nextGroupIdx + 1) % groups.length]!;
          layers.current.forEach(([a, b], i) => {
            const inactive = activeLayer.current[i] === 0 ? b : a;
            setImg(inactive, afterNextGroup[i]!);
            gsap.set(inactive, { yPercent: 110, opacity: 0 });
          });
          gsap.delayedCall(PAUSE, cycle);
        },
      });

      layers.current.forEach(([a, b], i) => {
        const active = activeLayer.current[i] === 0 ? a : b;
        const inactive = activeLayer.current[i] === 0 ? b : a;
        setImg(inactive, nextGroup[i]!);
        gsap.set(inactive, { yPercent: 110, opacity: 0 });
        tl.to(
          active,
          { yPercent: -110, opacity: 0, duration: DURATION, ease: EASE },
          i * STAGGER,
        );
        tl.to(
          inactive,
          { yPercent: 0, opacity: 1, duration: DURATION, ease: EASE },
          i * STAGGER,
        );
      });
    }

    return () => {
      reveal.kill();
      gsap.globalTimeline.clear();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      role="region"
      aria-label="Marcas asociadas"
      style={{
        position: "fixed",
        bottom: BOTTOM_OFFSET,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        filter: "brightness(0) invert(1)",
      }}
    >
      {groups[0]!.map((partner, i) => (
        <div
          key={partner.name}
          ref={(el) => {
            if (el) slotsRef.current[i] = el;
          }}
          style={{
            width: SLOT_W,
            height: SLOT_H,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
          aria-label={partner.name}
        >
          {([0, 1] as const).map((layer) => (
            <div
              key={layer}
              ref={(el) => {
                if (!el) return;
                if (!layers.current[i])
                  layers.current[i] = [null as any, null as any];
                layers.current[i]![layer] = el as HTMLDivElement;
              }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-hidden={layer === 1}
            >
              <Image
                src={partner.logo}
                alt={layer === 0 ? partner.name : ""}
                width={200}
                height={80}
                style={{
                  maxWidth: SLOT_W * partner.scale,
                  maxHeight: SLOT_H * partner.scale,
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── Export ──────────────────────────────────────────────────────
export const TrustedBrands = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileCarousel /> : <DesktopBrands />;
};
