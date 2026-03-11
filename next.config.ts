import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: false,
  trailingSlash: true,

  images: {
    unoptimized: true, // necesario con output: "export"
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año — imágenes estáticas
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Cabeceras de caché y seguridad — aplica incluso con output: "export"
  // cuando se sirve con un server (Nginx, Vercel edge, etc.)
  async headers() {
    return [
      {
        // Assets estáticos — cache agresivo (1 año)
        source:
          "/:path*.(js|css|woff2|woff|ttf|otf|ico|svg|png|jpg|jpeg|avif|webp|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // HTML — revalidar siempre
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permite el iframe de 3D Secure y otros orígenes de pago si es necesario:
          // { key: "Content-Security-Policy", value: "..." }
        ],
      },
    ];
  },

  experimental: {
    // optimizeCss: true, // requiere critters — descomentar si se instala
    // turbo: {}, // Turbopack en dev — más rápido que Webpack
  },
};

export default nextConfig;
