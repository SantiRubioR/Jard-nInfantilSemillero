import type { BlogCategory, BlogPost } from "./blog.types";

export const demoPosts: BlogPost[] = [
  {
    id: "demo-1",
    title: "Día del niño y la niña 2026",
    slug: "dia-del-nino-y-la-nina-2026",
    category: "evento",
    excerpt:
      "Una jornada mágica llena de juegos, títeres y muchas sonrisas. Celebramos la alegría de ser niños con toda nuestra comunidad.",
    content:
      "Una jornada mágica llena de juegos, títeres y muchas sonrisas. Celebramos la alegría de ser niños con toda nuestra comunidad.\n\nAgradecemos a las familias que acompañaron esta celebración y a todo el equipo docente por hacer posible un día inolvidable.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: null,
    publishedAt: "2026-10-25",
    isPublished: true,
    createdBy: null,
    createdAt: "2026-10-25T12:00:00.000Z",
    updatedAt: "2026-10-25T12:00:00.000Z",
  },
  {
    id: "demo-2",
    title: "Escuela para padres",
    slug: "escuela-para-padres",
    category: "evento",
    excerpt:
      "Fortaleciendo los lazos afectivos. Compartimos herramientas prácticas para el manejo de emociones en casa con nuestros especialistas.",
    content:
      "Fortaleciendo los lazos afectivos. Compartimos herramientas prácticas para el manejo de emociones en casa con nuestros especialistas.\n\nLa escuela para padres es un espacio de encuentro, escucha y aprendizaje conjunto entre la institución y las familias.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: null,
    publishedAt: "2026-11-12",
    isPublished: true,
    createdBy: null,
    createdAt: "2026-11-12T12:00:00.000Z",
    updatedAt: "2026-11-12T12:00:00.000Z",
  },
  {
    id: "demo-3",
    title: "Salida pedagógica",
    slug: "salida-pedagogica",
    category: "evento",
    excerpt:
      "Nuestros pequeños de Transición vivieron una experiencia inolvidable de contacto directo con la naturaleza y los animales.",
    content:
      "Nuestros pequeños de Transición vivieron una experiencia inolvidable de contacto directo con la naturaleza y los animales.\n\nEstas salidas complementan el trabajo de aula y despiertan la curiosidad científica de los niños.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: null,
    publishedAt: "2026-12-05",
    isPublished: true,
    createdBy: null,
    createdAt: "2026-12-05T12:00:00.000Z",
    updatedAt: "2026-12-05T12:00:00.000Z",
  },
  {
    id: "demo-4",
    title: "Clausura del 2026",
    slug: "clausura-del-2026",
    category: "evento",
    excerpt:
      "Felicitamos a todos nuestros estudiantes por sus grandes logros y avances en este periodo. ¡Estamos orgullosos de su crecimiento!",
    content:
      "Felicitamos a todos nuestros estudiantes por sus grandes logros y avances en este periodo. ¡Estamos orgullosos de su crecimiento!\n\nLa clausura será un espacio para reconocer el esfuerzo de los niños y el acompañamiento de las familias.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: null,
    publishedAt: "2026-12-15",
    isPublished: true,
    createdBy: null,
    createdAt: "2026-12-15T12:00:00.000Z",
    updatedAt: "2026-12-15T12:00:00.000Z",
  },
  {
    id: "demo-5",
    title: "Independencia de Colombia",
    slug: "independencia-de-colombia",
    category: "evento",
    excerpt:
      "Celebración con nuestros estudiantes del día de la independencia de Colombia, fortaleciendo el amor por nuestra historia y cultura.",
    content:
      "Celebración con nuestros estudiantes del día de la independencia de Colombia, fortaleciendo el amor por nuestra historia y cultura.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    pdfUrl: null,
    publishedAt: "2026-07-20",
    isPublished: true,
    createdBy: null,
    createdAt: "2026-07-20T12:00:00.000Z",
    updatedAt: "2026-07-20T12:00:00.000Z",
  },
  {
    id: "demo-6",
    title: "Circular inicio de año",
    slug: "circular-inicio-de-ano",
    category: "circular",
    excerpt:
      "Comunicado oficial con las fechas, documentos y recomendaciones para el inicio del año escolar 2027.",
    content:
      "Comunicado oficial con las fechas, documentos y recomendaciones para el inicio del año escolar 2027. Por favor leer con atención y conservar este documento.",
    coverImageUrl: null,
    pdfUrl: null,
    publishedAt: "2027-01-05",
    isPublished: true,
    createdBy: null,
    createdAt: "2027-01-05T12:00:00.000Z",
    updatedAt: "2027-01-05T12:00:00.000Z",
  },
];

export function listStaticPosts(category?: BlogCategory): BlogPost[] {
  return demoPosts.filter(
    (post) => post.isPublished && (!category || post.category === category),
  );
}

export function listStaticPostSlugs(): string[] {
  return demoPosts.map((post) => post.slug);
}

export function findStaticPostBySlug(slug: string): BlogPost | null {
  return demoPosts.find((post) => post.slug === slug && post.isPublished) ?? null;
}
