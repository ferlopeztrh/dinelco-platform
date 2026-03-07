"use client";

import Link from "next/link";
import { CircleUserRound, X, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SlideTextButton } from "@/components/ui/slide-text-button";
import { DinelcoLogoSvg } from "@/components/icons/dinelco-logo.svg";
import { NAV_LINKS } from "./nav-links";
import { useIsOverHero } from "@/hooks/use-hero-scroll";

type Lang = "es" | "en";

export const DesktopHeader = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("es");
  const isOverHero = useIsOverHero();

  const isSubmenuOpen = !!openMenu;
  const anyActive = !!openMenu || !!hoveredLink;
  const isTransparent = isOverHero && !isSubmenuOpen;

  const navTextColor = isTransparent ? "text-white" : "text-black";
  const dividerColor = isTransparent ? "bg-white/30" : "bg-gray-200";

  const getOpacity = (label: string) => {
    if (!anyActive) return 1;
    if (openMenu === label || hoveredLink === label) return 1;
    return 0.4;
  };

  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"));

  return (
    <div
      className="w-full relative"
      onMouseLeave={() => {
        setOpenMenu(null);
        setHoveredLink(null);
      }}
    >
      {/* Submenu panels */}
      {NAV_LINKS.filter((i) => i.submenu).map((item) => (
        <div
          key={item.label}
          role="region"
          aria-label={`Submenu de ${item.label}`}
          aria-hidden={openMenu !== item.label}
          className={cn(
            "absolute left-0 right-0 top-0 grid bg-white z-0",
            "transition-[grid-template-rows] duration-300 ease-in-out",
            openMenu === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="overflow-hidden">
            <div className="h-[68px]" aria-hidden />
            <div className="w-full px-10 py-12 flex gap-24">
              <div className="shrink-0 w-[420px]">
                <h2 className="text-[2rem] font-gilroy font-bold text-black">
                  {item.label}
                </h2>
              </div>
              <nav
                aria-label={item.label}
                className="flex flex-col gap-10 flex-1 group/submenu"
              >
                {item.submenu!.map((section) => (
                  <div key={section.category} className="flex flex-col gap-3">
                    <p className="text-[11px] font-notosans font-semibold uppercase text-[#595555]">
                      {section.category}
                    </p>
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpenMenu(null)}
                        className="group/link flex items-baseline gap-3 transition-opacity duration-150 group-hover/submenu:opacity-40 hover:!opacity-100"
                      >
                        <span className="text-[1.35rem] font-gilroy font-semibold text-foreground">
                          {link.label}
                        </span>
                        {link.description && (
                          <>
                            <span
                              className="text-gray-300 text-[1.1rem] opacity-0 group-hover/link:opacity-100 transition-opacity duration-150"
                              aria-hidden
                            >
                              |
                            </span>
                            <span className="font-gilroy text-[0.95rem] text-[#595555] font-normal opacity-0 group-hover/link:opacity-100 transition-opacity duration-150">
                              {link.description}
                            </span>
                          </>
                        )}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
              <div className="shrink-0 self-start">
                <button
                  onClick={() => setOpenMenu(null)}
                  aria-label={`Cerrar submenu de ${item.label}`}
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-150 text-foreground"
                >
                  <X size={18} strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Overlay oscuro cuando hay submenu abierto */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-[-1] transition-opacity duration-300 pointer-events-none",
          isSubmenuOpen ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />

      {/* Header bar */}
      <div
        className="relative z-10 w-full px-6 h-[68px] flex items-center transition-colors duration-300"
        style={{ backgroundColor: isTransparent ? "transparent" : "white" }}
      >
        <Link
          href="/"
          aria-label="Red dinelco — Ir al inicio"
          className="flex items-center shrink-0 mr-4"
        >
          <DinelcoLogoSvg
            variant={isTransparent ? "white" : "default"}
            width={115}
            height={29}
            className="-translate-y-1"
          />
        </Link>

        <div
          className={cn(
            "h-6 w-px shrink-0 mr-2 transition-colors duration-200",
            dividerColor,
          )}
          aria-hidden
        />

        <nav
          className="flex items-center flex-1 h-full"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((item) =>
            item.submenu ? (
              <button
                key={item.label}
                onMouseEnter={() => {
                  setOpenMenu(item.label);
                  setHoveredLink(null);
                }}
                aria-expanded={openMenu === item.label}
                aria-haspopup="true"
                className={cn(
                  "px-4 h-[68px] flex items-center text-base font-gilroy font-semibold whitespace-nowrap transition-[opacity,color] duration-200",
                  navTextColor,
                )}
                style={{ opacity: getOpacity(item.label) }}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                onMouseEnter={() => {
                  setHoveredLink(item.label);
                  setOpenMenu(null);
                }}
                onMouseLeave={() => setHoveredLink(null)}
                className={cn(
                  "px-4 h-[68px] flex items-center text-base font-gilroy font-semibold whitespace-nowrap transition-[opacity,color] duration-200",
                  navTextColor,
                )}
                style={{ opacity: getOpacity(item.label) }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleLang}
            className={cn(
              "h-[68px] px-3 flex items-center gap-1.5 text-sm font-notosans font-medium transition-[opacity,color] cursor-pointer duration-200",
              navTextColor,
            )}
            style={{ opacity: getOpacity("lang") }}
            onMouseEnter={() => setHoveredLink("lang")}
            onMouseLeave={() => setHoveredLink(null)}
            aria-label={
              lang === "es"
                ? "Cambiar idioma a inglés"
                : "Cambiar idioma a español"
            }
          >
            <Globe size={18} strokeWidth={1.75} aria-hidden />
            <span className="text-[13px]">{lang === "es" ? "ES" : "EN"}</span>
          </button>

          <div
            className={cn(
              "h-6 w-px shrink-0 transition-colors duration-200",
              dividerColor,
            )}
            aria-hidden
          />

          <button
            className={cn(
              "w-10 h-10 flex items-center justify-center transition-[opacity,color] cursor-pointer duration-200",
              navTextColor,
            )}
            style={{ opacity: getOpacity("profile") }}
            onMouseEnter={() => setHoveredLink("profile")}
            onMouseLeave={() => setHoveredLink(null)}
            aria-label="Mi cuenta"
          >
            <CircleUserRound size={20} strokeWidth={1.75} aria-hidden />
          </button>

          <SlideTextButton
            as="link"
            href="/contacto"
            label="Contactar"
            className="ml-1 px-6 py-3 rounded-md text-[15px] bg-primary"
          />
        </div>
      </div>
    </div>
  );
};
