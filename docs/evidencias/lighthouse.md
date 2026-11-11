# Evidencia Lighthouse · sitio estático

Fecha: 2 de noviembre de 2026  
Build: exportación estática (`npm run build` → `out/`)  
Servidor de prueba: `python3 -m http.server 3000 --directory out`  
URL auditada: `http://localhost:3000/`

```bash
npx lighthouse http://localhost:3000/ \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=lighthouse-static.json
```

## Resultados

| Categoría | Puntaje |
|---|---|
| Performance | **75** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

## Observaciones

- Cumple el mínimo de 70 en rendimiento, accesibilidad y buenas prácticas.
- El servidor de prueba de Python no aplica compresión gzip/brotli ni CDN. En Cloudflare Pages o Netlify se espera una mejora.
- Las imágenes remotas de Unsplash se sirven sin optimización porque la exportación estática usa `images.unoptimized`.
- Para producción se recomienda reemplazar las imágenes de ejemplo por fotografías locales comprimidas en WebP y de menor resolución.
- Repetir la medición sobre la URL real del hosting antes de la entrega final y guardar la captura.
