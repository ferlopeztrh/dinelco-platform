"use client";

import { useEffect, useRef, useState } from "react";

export type HeaderVisibility = "transparent" | "visible" | "hidden";

export function useHeaderScroll(threshold?: number): HeaderVisibility {
  const [visibility, setVisibility] = useState<HeaderVisibility>("transparent");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const limit = threshold ?? window.innerHeight * 0.9;
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      const prev = lastScrollY.current;

      if (current < limit) {
        setVisibility("transparent");
      } else {
        // Fuera del hero: arriba → visible, abajo → hidden
        setVisibility(current < prev ? "visible" : "hidden");
      }

      lastScrollY.current = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visibility;
}
