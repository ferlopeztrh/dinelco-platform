import { gilroy } from "@/fonts/gilroy";
import { notoSans } from "@/fonts/noto-sans";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dinelco | Platform",
  description:
    "Plataforma fintech de la red dinelco para desarrolladores, con documentación, guías y recursos para integrar nuestros servicios de pago en tus aplicaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PY">
      <body
        className={`${gilroy.variable} ${notoSans.variable} antialiased overflow-x-hidden`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
