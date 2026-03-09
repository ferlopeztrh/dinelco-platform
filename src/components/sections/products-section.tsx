"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import checkoutLogo from "@/assets/products/checkout-logo.png";
import linkLogo from "@/assets/products/link-logo.png";
import posLogo from "@/assets/products/pos-logo.png";
import portalImage from "@/assets/products/portal-comercios.png";
import pattern1 from "@/assets/patterns/pattern1.svg";
import pattern2 from "@/assets/patterns/pattern2.svg";
import { SlideTextButton } from "../ui/slide-text-button";
import { PortalComerciosSection } from "./portal-comercios-section";

gsap.registerPlugin(ScrollTrigger, SplitText);

const products = [
  {
    label: "Checkout Dinelco",
    href: "/productos/checkout",
    description:
      "Acepta pagos con tarjeta en tu sitio web de forma segura y sin fricciones.",
    logo: checkoutLogo,
    imageClassName: "object-contain md:p-16 p-12",
  },
  {
    label: "DLink",
    href: "/productos/dlink",
    description:
      "Generá enlaces de cobro y comparte por WhatsApp, redes sociales o email.",
    logo: linkLogo,
    imageClassName: "object-contain md:p-22 p-16",
  },
  {
    label: "POS",
    href: "/productos/pos",
    description:
      "Terminales físicas para cobrar con tarjeta directamente en tu local.",
    logo: posLogo,
    imageClassName: "object-contain md:p-16 p-12",
  },
];

const VISIBLE_MOBILE = 1.15;
const SIDE_PADDING = 24;

function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
    };
    const handleLeave = () => {
      card.style.setProperty("--x", "-999px");
      card.style.setProperty("--y", "-999px");
    };
    card.addEventListener("mousemove", handleMove, { passive: true });
    card.addEventListener("mouseleave", handleLeave, { passive: true });
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);
  return (
    <div ref={cardRef} className={`spotlight-card ${className ?? ""}`}>
      {children}
    </div>
  );
}

export const ProductsSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const productEls = useRef<HTMLLIElement[]>([]);

  // ── Título ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const init = () => {
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
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.1,
          }),
      });
      return () => {
        st.kill();
        split.lines.forEach((line) => {
          const mask = line.parentElement;
          if (mask && mask !== el) {
            mask.parentNode?.insertBefore(line, mask);
            mask.parentNode?.removeChild(mask);
          }
        });
        split.revert();
      };
    };
    if (document.fonts.status === "loaded") return init();
    let cleanup: (() => void) | undefined;
    document.fonts.ready.then(() => {
      cleanup = init();
    });
    return () => cleanup?.();
  }, []);

  // ── Cards: scrub ─────────────────────────────────────────────────────────
  useEffect(() => {
    const cards = productEls.current.filter(Boolean);
    if (!cards.length) return;
    gsap.set(cards, { y: 100, scale: 0.95 });
    const cardSTs = cards.map((card, i) =>
      gsap.fromTo(
        card,
        { y: 100, scale: 0.95 },
        {
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: `top ${95 - i * 8}%`,
            end: `top ${45 - i * 4}%`,
            scrub: 1.2,
          },
        },
      ),
    );
    return () => cardSTs.forEach((t) => t.scrollTrigger?.kill());
  }, []);

  return (
    <section
      aria-label="Productos Dinelco"
      className="relative overflow-hidden py-20"
    >
      <div
        className="hidden md:block absolute left-12 top-42 -translate-y-1/2 w-56 pointer-events-none select-none opacity-25"
        aria-hidden
      >
        <Image src={pattern1} alt="" />
      </div>
      <div
        className="hidden md:block absolute right-12 -bottom-46 -translate-y-1/2 w-90 rotate-90 pointer-events-none select-none opacity-25"
        aria-hidden
      >
        <Image src={pattern2} alt="" />
      </div>

      <div className="relative px-6 md:px-64">
        <div className="max-w-3xl mx-auto text-left mb-10 md:mb-12">
          <h2
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl font-gilroy font-semibold leading-[1.35] tracking-tight"
          >
            Un ecosistema de pagos pensado para tu negocio,{" "}
            <span className="font-black bg-linear-to-r from-primary via-primary via-0% to-secondary bg-clip-text text-transparent">
              todos bajo la misma red.
            </span>
          </h2>
        </div>

        <ul
          ref={gridRef}
          className="hidden md:grid grid-cols-3 gap-6 list-none p-0"
        >
          {products.map((product, i) => (
            <li
              key={product.href}
              ref={(el) => {
                if (el) productEls.current[i] = el;
              }}
            >
              <Link href={product.href} className="group flex flex-col">
                <SpotlightCard className="relative w-full aspect-4/3 rounded-2xl bg-white">
                  {product.logo && (
                    <Image
                      src={product.logo}
                      alt={`Logo de ${product.label}`}
                      fill
                      priority
                      className={product.imageClassName}
                    />
                  )}
                </SpotlightCard>
                <div className="pt-4">
                  <p className="font-gilroy font-black text-2xl text-foreground mb-0.5 group-hover:text-primary transition-colors duration-200">
                    {product.label}
                  </p>
                  <p className="font-notosans text-sm text-label leading-snug">
                    {product.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="md:hidden -mx-6">
          <ul
            role="region"
            aria-label="Productos Dinelco"
            className="flex gap-4 list-none p-0 overflow-x-auto"
            style={{
              scrollSnapType: "x proximity",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingLeft: SIDE_PADDING,
              paddingRight: SIDE_PADDING,
              scrollPaddingLeft: SIDE_PADDING,
            }}
          >
            {products.map((product) => (
              <li
                key={product.href}
                className="shrink-0 flex flex-col"
                style={{
                  scrollSnapAlign: "start",
                  width: `calc((100vw - ${SIDE_PADDING * 2}px) / ${VISIBLE_MOBILE})`,
                }}
              >
                <Link href={product.href} className="flex flex-col group">
                  <div className="relative w-full aspect-[4/3] rounded-2xl border border-gray-200 bg-white">
                    {product.logo && (
                      <Image
                        src={product.logo}
                        alt={`Logo de ${product.label}`}
                        fill
                        className={product.imageClassName}
                      />
                    )}
                  </div>
                  <div className="pt-3">
                    <p className="font-gilroy font-bold text-lg text-foreground mb-0.5 group-hover:text-primary transition-colors duration-200">
                      {product.label}
                    </p>
                    <p className="font-notosans text-sm text-label leading-snug">
                      {product.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center mt-10">
          <SlideTextButton
            href="/productos"
            label="Ver todos los productos"
            className="px-7 py-3 rounded-md border-2 border-secondary text-base font-gilroy font-bold text-secondary transition-colors duration-200"
          />
        </div>
      </div>

      <PortalComerciosSection />
    </section>
  );
};
