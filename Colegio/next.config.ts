import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportación estática: genera HTML/CSS/JS en `out/` para publicar en
  // Cloudflare Pages, Netlify, GitHub Pages o cualquier hosting estático.
  output: "export",
  trailingSlash: true,
  images: {
    // En exportación estática no hay servidor de optimización de imágenes.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
