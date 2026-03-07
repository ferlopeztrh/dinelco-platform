"use client";

import Link from "next/link";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Menu,
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

  return (
    <div
      className={cn(
        "fixed z-[200] transition-[inset,border-radius] duration-300 ease-in-out bg-white",
        menuOpen ? "inset-0 rounded-none" : "top-3 left-4 right-4 rounded-md",
      )}
      style={{
        border: menuOpen ? "none" : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 h-[52px]">
        <Link
          href="/"
          onClick={menuOpen ? closeAll : undefined}
          aria-label="Red dinelco — Ir al inicio"
          className="flex items-center"
        >
          <DinelcoLogoSvg width={120} height={40} />
        </Link>
        <button
          type="button"
          onClick={() => (menuOpen ? closeAll() : setMenuOpen(true))}
          className="w-9 h-9 flex items-center justify-center"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? (
            <X size={20} strokeWidth={1.75} aria-hidden />
          ) : (
            <Menu size={20} strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>

      {/* Contenido expandido */}
      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden transition-[height,opacity] duration-300 ease-in-out",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none h-0",
        )}
        style={menuOpen ? { height: "calc(100dvh - 52px)" } : {}}
        aria-hidden={!menuOpen}
      >
        {/* ── Pantalla raíz ── */}
        <div
          className={cn(
            "absolute inset-x-0 flex flex-col transition-opacity duration-200",
            activeSubmenu ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
          style={{ top: 52, bottom: 0 }}
          aria-hidden={!!activeSubmenu}
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
                    aria-expanded={activeSubmenu?.label === item.label}
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

          {/* Footer del menú */}
          <div className="px-6 py-6 border-t border-gray-100 flex flex-col gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-3 text-[0.95rem] text-foreground font-medium font-notosans"
              aria-label={
                lang === "es"
                  ? "Cambiar idioma a inglés"
                  : "Cambiar idioma a español"
              }
            >
              <Globe
                size={18}
                strokeWidth={1.75}
                className="text-gray-500"
                aria-hidden
              />
              {lang === "es" ? "Español" : "English"}
            </button>
            <Link
              href="/portal"
              onClick={closeAll}
              className="flex items-center gap-3 text-[0.95rem] text-foreground font-medium font-notosans"
            >
              <CircleUserRound
                size={18}
                strokeWidth={1.75}
                className="text-gray-500"
                aria-hidden
              />
              Iniciar sesión
            </Link>
            <Link
              href="/contacto"
              onClick={closeAll}
              className="mt-1 block w-full py-3 rounded-xl text-[15px] font-gilroy font-semibold text-white text-center bg-primary"
            >
              Contactar
            </Link>
          </div>
        </div>

        {/* ── Pantalla submenu ── */}
        <div
          className={cn(
            "absolute inset-x-0 flex flex-col bg-white transition-opacity duration-200",
            activeSubmenu ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          style={{ top: 52, bottom: 0 }}
          aria-hidden={!activeSubmenu}
        >
          <div className="h-px bg-gray-100 mx-6" aria-hidden />
          <div className="flex items-center px-6 py-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveSubmenu(null)}
              className="flex items-center gap-2 font-gilroy font-semibold text-[1.1rem] text-foreground"
              aria-label={`Volver al menú principal desde ${activeSubmenu?.label}`}
            >
              <ChevronLeft size={20} strokeWidth={1.75} aria-hidden />
              {activeSubmenu?.label}
            </button>
          </div>

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
    </div>
  );
};
