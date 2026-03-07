"use client";

import Link from "next/link";
import Image from "next/image";
import checkoutLogo from "@/assets/products/checkout-logo.png";
import linkLogo from "@/assets/products/link-logo.png";
import posLogo from "@/assets/products/pos-logo.png";
import portalImage from "@/assets/products/portal-comercios.png";
import pattern1 from "@/assets/patterns/pattern1.svg";
import pattern2 from "@/assets/patterns/pattern2.svg";
import { SlideTextButton } from "../ui/slide-text-button";

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

export const ProductsSection = () => {
  return (
    <section
      aria-label="Productos Dinelco"
      className="relative overflow-hidden pb-12"
    >
      {/* Patterns decorativos — solo desktop */}
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
        {/* Título */}
        <div className="max-w-3xl mx-auto text-left mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy font-semibold leading-[1.35] tracking-tight">
            Un ecosistema de pagos pensado para tu negocio,{" "}
            <span className="font-black bg-linear-to-r from-primary via-primary via-0% to-secondary bg-clip-text text-transparent">
              todos bajo la misma red.
            </span>
          </h2>
        </div>

        {/* Desktop: grid */}
        <ul className="hidden md:grid grid-cols-3 gap-6 list-none p-0">
          {products.map((product) => (
            <li key={product.href}>
              <Link href={product.href} className="group flex flex-col group">
                <div
                  className="spotlight-card relative w-full aspect-4/3 rounded-2xl bg-white"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty(
                      "--x",
                      `${e.clientX - rect.left}px`,
                    );
                    e.currentTarget.style.setProperty(
                      "--y",
                      `${e.clientY - rect.top}px`,
                    );
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("--x", "-999px");
                    e.currentTarget.style.setProperty("--y", "-999px");
                  }}
                >
                  {product.logo && (
                    <Image
                      src={product.logo}
                      alt={`Logo de ${product.label}`}
                      fill
                      priority
                      className={product.imageClassName}
                    />
                  )}
                </div>
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

        {/* Mobile: scroll nativo con CSS snap */}
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

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <SlideTextButton
            href="/productos"
            label="Ver todos los productos"
            className="px-7 py-3 rounded-xl border-2 border-secondary text-base font-gilroy font-bold text-secondary transition-colors duration-200"
          />
        </div>
      </div>

      {/* Portal Comercios feature */}
      <div className="relative mt-12 px-6 md:px-48">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 shrink-0">
            <Image
              src={portalImage}
              alt="Pantalla del Portal de Comercios Dinelco en laptop y móvil"
              className="w-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-4xl md:text-5xl font-gilroy font-black leading-[1.35] tracking-tight mb-8 bg-gradient-to-r from-primary via-0% to-secondary bg-clip-text text-transparent">
              Portal de comercios
            </h3>
            {/* Lista semántica con role descriptivo */}
            <ul
              aria-label="Funcionalidades del Portal de Comercios"
              className="flex flex-col gap-5 max-w-2xl mx-auto md:mx-0 list-none p-0"
            >
              <li className="font-notosans text-base font-bold md:text-lg text-label leading-relaxed">
                Accedé a información detallada y en línea de todas las
                transacciones realizadas en tu negocio.
              </li>
              <li className="font-notosans text-base font-bold md:text-lg text-label leading-relaxed">
                Monitoreá tus ventas por sucursal y/o producto y accedé a tus
                facturas.
              </li>
              <li className="font-notosans text-base font-bold md:text-lg text-label leading-relaxed">
                Solicitá soporte técnico, accesorios o chateá con nuestro centro
                de atención.
              </li>
            </ul>
            <p className="font-gilroy font-semibold text-sm text-secondary mt-8">
              * Beneficio para todos los comercios afiliados a la red dinelco.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
