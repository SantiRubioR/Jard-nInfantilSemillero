export type AcademicLevelContent = {
  slug: string;
  name: string;
  description: string;
  schedule: string;
};

export const institutionalContent = {
  hero: {
    title: "Educando con amor y conocimiento",
    subtitle:
      "Somos una de las instituciones entre los planteles más experimentados y prestigiosos de su categoría de formación.",
  },
  history: {
    title: "Reseña histórica",
    text: "Con más de 20 años de trayectoria en Ibagué, hemos crecido junto a cientos de familias, sembrando aprendizajes y acompañando los primeros pasos de nuestros niños.",
  },
  mission: {
    title: "Misión",
    text: "Formar niños felices, curiosos y seguros mediante experiencias significativas y afectuosas que fortalezcan su desarrollo integral.",
  },
  vision: {
    title: "Visión",
    text: "Liderar la educación inicial con innovación pedagógica y compromiso social para el año 2030, siendo referente en Ibagué y el Tolima.",
  },
  pedagogicalModel: {
    title: "Modelo pedagógico",
    text: "Enfoque constructivista donde el juego es la herramienta principal de descubrimiento, expresión y aprendizaje.",
  },
  commitment: {
    title: "Nuestro compromiso con la excelencia académica",
    text: "Cada nivel está diseñado bajo los lineamientos del Ministerio de Educación Nacional, integrando nuestra metodología propia basada en el juego y la efectividad.",
    bullets: [
      "Ambientes de aprendizaje seguros y modernos.",
      "Docentes tituladas y en constante capacitación.",
      "Seguimiento psicopedagógico personalizado.",
    ],
  },
};

export const academicLevels: AcademicLevelContent[] = [
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

export const uniforms = [
  {
    title: "Uniforme de diario - Niños",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
    description:
      "Compuesto por pantalón institucional, camisa blanca de cuello y zapatos escolares. Promueve la formalidad y el sentido de pertenencia.",
  },
  {
    title: "Uniforme de diario - Niñas",
    image:
      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=900&q=80",
    description:
      "Compuesto por jardinería, camisa blanca de cuello, medias blancas y zapatos escolares. Promueve la formalidad y el sentido de pertenencia.",
  },
  {
    title: "Uniforme de educación física - Mixto",
    image:
      "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?auto=format&fit=crop&w=900&q=80",
    description:
      "Sudadera institucional, camiseta deportiva y tenis blancos. Diseñado con telas inteligentes que permiten la transpiración y libertad de movimiento.",
  },
];

export const institutionalValues = [
  "Respeto por la diferencia",
  "Aprendizaje a través del juego",
  "Acompañamiento a las familias",
  "Formación integral y afectiva",
];
