export type AcademicLevelContent = {
  slug: string;
  name: string;
  description: string;
  schedule: string;
};

export type AcademicLevel = AcademicLevelContent & {
  id: string;
  pdfUrl: string | null;
  updatedAt: string;
};

export const academicLevelCatalog: AcademicLevelContent[] = [
  {
    slug: "prejardin",
    name: "Prejardín",
    description:
      "Espacio de exploración, juego y socialización que acompaña los primeros pasos del niño en la vida escolar, fortaleciendo autonomía, lenguaje y motricidad.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "jardin",
    name: "Jardín",
    description:
      "Los niños consolidan hábitos, amplían su vocabulario y descubren el mundo a través de experiencias sensoriales, artísticas y de juego dirigido.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "transicion",
    name: "Transición",
    description:
      "Preparamos el paso a la básica primaria con énfasis en lectoescritura inicial, pensamiento lógico-matemático y habilidades socioemocionales.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "primero",
    name: "Primero",
    description:
      "Consolidación de la lectura, la escritura y el cálculo inicial mediante proyectos integradores y experiencias significativas.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "segundo",
    name: "Segundo",
    description:
      "Fortalecimiento de la comprensión lectora, la producción textual y el razonamiento matemático con acompañamiento personalizado.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "tercero",
    name: "Tercero",
    description:
      "Consolidación de procesos pre-escritos y lógico-matemáticos. Potenciamos la creatividad y la expresión artística como ejes transversales.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "cuarto",
    name: "Cuarto",
    description:
      "Desarrollo del pensamiento crítico y la investigación guiada, integrando ciencia, tecnología, arte y convivencia ciudadana.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
  {
    slug: "quinto",
    name: "Quinto",
    description:
      "Cierre de la básica primaria con proyectos de síntesis, liderazgo estudiantil y preparación para la educación secundaria.",
    schedule: "Lunes a viernes, 8:00 a.m. a 12:00 m.",
  },
];

const levelOrder = new Map(
  academicLevelCatalog.map((level, index) => [level.slug, index]),
);

export function sortAcademicLevels(levels: AcademicLevel[]): AcademicLevel[] {
  return [...levels].sort(
    (a, b) => (levelOrder.get(a.slug) ?? 99) - (levelOrder.get(b.slug) ?? 99),
  );
}

export function findAcademicLevelContent(slug: string) {
  return academicLevelCatalog.find((level) => level.slug === slug);
}
