"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve true cuando el usuario está DENTRO del hero (scrollY < threshold).
 * El threshold por defecto es el 90% del primer viewport height.
 */
export function useIsOverHero(threshold?: number) {
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const limit = threshold ?? window.innerHeight * 0.9;

    const check = () => setIsOverHero(window.scrollY < limit);

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [threshold]);

  return isOverHero;
}
