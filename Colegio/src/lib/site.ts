export const siteConfig = {
  name: "Jardín Infantil Semillero",
  shortName: "Semillero",
  description:
    "Plataforma informativa y pedagógica del Jardín Infantil Semillero de Ibagué. Educación inicial y básica primaria con amor, juego y conocimiento.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    address: "Mza M casa 6, Barrio Jordán 9a Etapa",
    city: "Ibagué, Tolima, Colombia",
    phone: "+57 314 6037663",
    phoneHref: "+573146037663",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573146037663",
    email: "angulo-85@hotmail.com",
    dane: "373001007573",
    hours: "Lunes a viernes, 8:00 a.m. a 4:00 p.m.",
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Educación", href: "/educacion/" },
    { label: "Nosotros", href: "/nosotros/" },
    { label: "Blog", href: "/blog/" },
    { label: "Contacto", href: "/contacto/" },
  ],
} as const;

export const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
  "Estoy interesado en conocer el Jardín Infantil Semillero",
)}`;

export const mapQuery =
  process.env.NEXT_PUBLIC_MAP_QUERY ??
  "Mza M casa 6 Barrio Jordan 9a Etapa, Ibague, Tolima, Colombia";

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  mapQuery,
)}&output=embed`;
