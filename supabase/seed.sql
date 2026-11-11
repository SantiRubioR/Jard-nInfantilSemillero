-- ============================================================
-- Datos iniciales del Jardín Infantil Semillero
-- Ejecutar después de 0001_init.sql
-- ============================================================

insert into public.academic_levels (slug, name, pdf_url)
values
  ('prejardin', 'Prejardín', null),
  ('jardin', 'Jardín', null),
  ('transicion', 'Transición', null),
  ('primero', 'Primero', null),
  ('segundo', 'Segundo', null),
  ('tercero', 'Tercero', null),
  ('cuarto', 'Cuarto', null),
  ('quinto', 'Quinto', null)
on conflict (slug) do nothing;

insert into public.institutional_documents (type, title, pdf_url)
values
  ('manual_convivencia', 'Manual de convivencia', null),
  ('resolucion_estudios', 'Resolución de estudios', null)
on conflict (type) do nothing;

insert into public.statistics (key, label, value)
values
  ('docentes', 'Docentes', 7),
  ('estudiantes', 'Estudiantes', 70),
  ('graduados', 'Graduados', 250),
  ('anios_experiencia', 'Años de experiencia', 20)
on conflict (key) do update
set label = excluded.label,
    value = excluded.value;

insert into public.facilities (title, description, image_url, sort_order, is_active)
values
  (
    'Aula de clases',
    'Espacios iluminados y organizados para el aprendizaje activo y el trabajo colaborativo.',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80',
    1,
    true
  ),
  (
    'Comedor escolar',
    'Un lugar limpio y acogedor para compartir los alimentos y fortalecer hábitos saludables.',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=1400&q=80',
    2,
    true
  ),
  (
    'Zona de juego',
    'Juegos infantiles seguros que estimulan la motricidad, la imaginación y la socialización.',
    'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?auto=format&fit=crop&w=1400&q=80',
    3,
    true
  ),
  (
    'Aula de prejardín',
    'Ambiente diseñado para los más pequeños, con materiales didácticos y espacios de exploración.',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1400&q=80',
    4,
    true
  )
on conflict (title) do nothing;

insert into public.blog_posts
  (title, slug, category, excerpt, content, cover_image_url, pdf_url, published_at, is_published)
values
  (
    'Día del niño y la niña 2026',
    'dia-del-nino-y-la-nina-2026',
    'evento',
    'Una jornada mágica llena de juegos, títeres y muchas sonrisas. Celebramos la alegría de ser niños con toda nuestra comunidad.',
    'Una jornada mágica llena de juegos, títeres y muchas sonrisas. Celebramos la alegría de ser niños con toda nuestra comunidad.

Agradecemos a las familias que acompañaron esta celebración y a todo el equipo docente por hacer posible un día inolvidable.',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
    null,
    '2026-10-25',
    true
  ),
  (
    'Escuela para padres',
    'escuela-para-padres',
    'evento',
    'Fortaleciendo los lazos afectivos. Compartimos herramientas prácticas para el manejo de emociones en casa con nuestros especialistas.',
    'Fortaleciendo los lazos afectivos. Compartimos herramientas prácticas para el manejo de emociones en casa con nuestros especialistas.

La escuela para padres es un espacio de encuentro, escucha y aprendizaje conjunto entre la institución y las familias.',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    null,
    '2026-11-12',
    true
  ),
  (
    'Salida pedagógica',
    'salida-pedagogica',
    'evento',
    'Nuestros pequeños de Transición vivieron una experiencia inolvidable de contacto directo con la naturaleza y los animales.',
    'Nuestros pequeños de Transición vivieron una experiencia inolvidable de contacto directo con la naturaleza y los animales.

Estas salidas complementan el trabajo de aula y despiertan la curiosidad científica de los niños.',
    'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1200&q=80',
    null,
    '2026-12-05',
    true
  ),
  (
    'Clausura del 2026',
    'clausura-del-2026',
    'evento',
    'Felicitamos a todos nuestros estudiantes por sus grandes logros y avances en este periodo. ¡Estamos orgullosos de su crecimiento!',
    'Felicitamos a todos nuestros estudiantes por sus grandes logros y avances en este periodo. ¡Estamos orgullosos de su crecimiento!

La clausura será un espacio para reconocer el esfuerzo de los niños y el acompañamiento de las familias.',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    null,
    '2026-12-15',
    true
  ),
  (
    'Independencia de Colombia',
    'independencia-de-colombia',
    'evento',
    'Celebración con nuestros estudiantes del día de la independencia de Colombia, fortaleciendo el amor por nuestra historia y cultura.',
    'Celebración con nuestros estudiantes del día de la independencia de Colombia, fortaleciendo el amor por nuestra historia y cultura.',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    null,
    '2026-07-20',
    true
  ),
  (
    'Circular inicio de año',
    'circular-inicio-de-ano',
    'circular',
    'Comunicado oficial con las fechas, documentos y recomendaciones para el inicio del año escolar 2027.',
    'Comunicado oficial con las fechas, documentos y recomendaciones para el inicio del año escolar 2027. Por favor leer con atención y conservar este documento.',
    null,
    null,
    '2027-01-05',
    true
  )
on conflict (slug) do nothing;
