"use client";

import Link from "next/link";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CircleUserRound,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DinelcoLogoSvg } from "@/components/icons/dinelco-logo.svg";
import { NAV_LINKS, NavItem } from "./nav-links";

type Lang = "es" | "en";

export const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null);
  const [lang, setLang] = useState<Lang>("es");

  const closeAll = () => {
    setMenuOpen(false);
    setActiveSubmenu(null);
  };
  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"));
  const inSub = !!activeSubmenu;

  return (
    <>
      {/* ── Topbar fija — siempre visible, nunca animada ── */}
      <div
        className={cn(
          "fixed z-[201] flex items-center justify-between px-4 h-[52px] bg-white",
          "transition-[inset,border-radius,border-color] duration-300 ease-in-out",
          menuOpen
            ? "top-0 left-0 right-0 rounded-none border-b border-gray-100"
            : "top-3 left-4 right-4 rounded-md border border-black/[0.08]",
        )}
      >
        {/* Zona izquierda: ticker logo ↔ título */}
        <div className="flex-1 h-[52px] overflow-hidden">
          <div
            className="transition-transform duration-300 ease-in-out"
            style={{ transform: inSub ? "translateY(-52px)" : "translateY(0)" }}
          >
            {/* Fila 0 — Logo */}
            <div className="h-[52px] flex items-center">
              <Link
                href="/"
                onClick={menuOpen ? closeAll : undefined}
                aria-label="Red dinelco — Ir al inicio"
              >
                <DinelcoLogoSvg width={120} height={40} />
              </Link>
            </div>
            {/* Fila 1 — Volver + título submenu */}
            <div className="h-[52px] flex items-center">
              <button
                type="button"
                onClick={() => setActiveSubmenu(null)}
                aria-label="Volver al menú principal"
                className="flex items-center gap-1.5 font-gilroy font-semibold text-[1.1rem] text-foreground"
              >
                <ChevronLeft
                  size={18}
                  strokeWidth={1.75}
                  className="text-gray-400 shrink-0"
                  aria-hidden
                />
                {activeSubmenu?.label ?? ""}
              </button>
            </div>
          </div>
        </div>

        {/* Botón hamburguesa / cerrar */}
        <button
          type="button"
          onClick={() => (menuOpen ? closeAll() : setMenuOpen(true))}
          className="w-9 h-9 flex items-center justify-center shrink-0"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? (
            <X size={20} strokeWidth={1.75} aria-hidden />
          ) : (
            <svg
              width="20"
              height="12"
              viewBox="0 0 20 12"
              fill="none"
              aria-hidden
            >
              <line
                x1="0"
                y1="1"
                x2="20"
                y2="1"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="11"
                x2="20"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── Panel que cae desde arriba ── */}
      {/*
       * El panel está SIEMPRE en el DOM (no condicional) para que la
       * transición de cierre también se vea. Se posiciona justo debajo
       * de la topbar (top-[52px]) y usa translateY + opacity para el slide.
       * overflow-hidden en el panel mismo contiene el scroll interno
       * sin afectar al contenedor externo.
       */}
      <div
        id="mobile-nav"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed left-0 right-0 z-[200] bg-white",
          "top-[52px]",
          "transition-[transform,opacity] duration-300 ease-in-out",
          menuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-6 opacity-0 pointer-events-none",
        )}
        style={{ height: "calc(100dvh - 52px)" }}
      >
        {/* Pantalla raíz */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ display: inSub ? "none" : undefined }}
          aria-hidden={inSub}
        >
          <div className="h-px bg-gray-100 mx-6" aria-hidden />
          <nav
            aria-label="Navegación principal"
            className="flex-1 overflow-y-auto px-6 pt-2"
          >
            {NAV_LINKS.map((item) => (
              <div
                key={item.label}
                className="border-b border-gray-100 last:border-0"
              >
                {item.submenu ? (
                  <button
                    type="button"
                    onClick={() => setActiveSubmenu(item)}
                    aria-haspopup="true"
                    className="w-full flex items-center justify-between py-4 text-[1.1rem] font-gilroy font-semibold text-foreground"
                  >
                    {item.label}
                    <ChevronRight
                      size={18}
                      strokeWidth={1.75}
                      className="text-gray-400"
                      aria-hidden
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={closeAll}
                    className="flex items-center justify-between py-4 text-[1.1rem] font-gilroy font-semibold text-foreground"
                  >
                    {item.label}
                    <ChevronRight
                      size={18}
                      strokeWidth={1.75}
                      className="text-gray-400"
                      aria-hidden
                    />
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="px-6 py-6 border-t border-gray-100 flex flex-col gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-3 text-base text-foreground font-semibold font-gilroy"
              aria-label={
                lang === "es"
                  ? "Cambiar idioma a inglés"
                  : "Cambiar idioma a español"
              }
            >
              <Globe
                size={18}
                strokeWidth={1.75}
                className="text-foreground"
                aria-hidden
              />
              {lang === "es" ? "Español" : "English"}
            </button>
            <Link
              href="/portal"
              onClick={closeAll}
              className="flex items-center gap-3 text-base text-foreground font-semibold font-gilroy"
            >
              <CircleUserRound
                size={18}
                strokeWidth={1.75}
                className="text-foreground"
                aria-hidden
              />
              Iniciar sesión
            </Link>
            <Link
              href="/contacto"
              onClick={closeAll}
              className="mt-1 block w-full py-3 rounded-md text-base font-gilroy font-semibold text-white text-center bg-primary"
            >
              Contactar
            </Link>
          </div>
        </div>

        {/* Pantalla submenu */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ display: inSub ? undefined : "none" }}
          aria-hidden={!inSub}
        >
          <div className="h-px bg-gray-100 mx-6" aria-hidden />
          <nav
            aria-label={`Submenu de ${activeSubmenu?.label}`}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            {activeSubmenu?.submenu?.map((section) => (
              <div key={section.category} className="mb-8">
                <p className="text-[11px] font-notosans font-semibold tracking-widest uppercase text-[#595555] block mb-3">
                  {section.category}
                </p>
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAll}
                    className="flex flex-col py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-[1.05rem] font-gilroy font-semibold text-foreground">
                      {link.label}
                    </span>
                    {link.description && (
                      <span className="text-[0.85rem] text-[#595555] mt-0.5 font-notosans">
                        {link.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay oscuro detrás del panel */}
      <div
        className={cn(
          "fixed inset-0 z-[199] bg-black/40",
          "transition-opacity duration-300",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden
        onClick={closeAll}
      />
    </>
  );
};
