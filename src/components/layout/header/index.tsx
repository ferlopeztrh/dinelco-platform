"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";

export const Header = () => {
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.4,
        clearProps: "transform,opacity",
      },
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="w-full bg-transparent fixed top-0 z-50"
      role="banner"
    >
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
    </header>
  );
};
