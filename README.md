# JardinInfantilSemillero

# 🏫 Plataforma Web y Custom CMS — Jardín Infantil Semillero

Plataforma web Full Stack con módulo de administración de contenidos (CMS) a la medida, desarrollada para la gestión informativa, divulgación pedagógica y automatización de procesos digitales del **Jardín Infantil Semillero** de la ciudad de Ibagué.

---

## 📌 Información del Proyecto

* **Título del Proyecto:** Desarrollo e implementación de una plataforma web Full Stack con módulo administrable para la gestión informativa y pedagógica del Jardín Infantil Semillero de la ciudad de Ibagué.
* **Autor:** David Santiago Rubio Rincón
* **Programa:** Ingeniería de Software — Facultad de Ingeniería
* **Institución:** Corporación Universitaria Iberoamericana
* **Docente Tutora:** Magda Paola Fernández Echeverri
* **Entidad Beneficiaria:** Jardín Infantil Semillero (Ibagué, Tolima)
* **Ubicación & Período:** Ibagué, Tolima — Agosto a Diciembre 2026

---

## 🚀 Arquitectura y Tech Stack

El proyecto implementa un patrón de **Monolito Moderno** garantizando un costo operacional cero ($0 COP) al ejecutarse sobre capas gratuitas y de código abierto:

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS.
* **Backend & API:** Node.js (Next.js Server Actions / API Routes).
* **Base de Datos & Auth:** Supabase (PostgreSQL relacional, Supabase Auth con RBAC / JWT, Supabase Storage).
* **Integraciones:** WhatsApp Business API (atención a padres) y Google Maps API (ubicación interactiva).
* **Calidad & Rendimiento:** Google Lighthouse & Normas de accesibilidad WCAG 2.1 (Nivel AA).
* **Hosting / Despliegue CI/CD:** Heliohost.

---

## 💻 Características Principales (MVP)

### 🌐 Portal Público Informativo (`/`)
* **Inicio (`/`):** Banner institucional, pilares de compromiso pedagógico y contadores estadísticos dinámicos.
* **Educación (`/educacion`):** Acordeón interactivo por niveles académicos (Prejardín a Quinto) con descarga de temarios institucionales en PDF.
* **Nosotros (`/nosotros`):** Galería visual de instalaciones, muestra de uniformes y descarga de resolución / manual de convivencia.
* **Blog (`/blog`):** Sección de noticias, circulares y eventos filtrables.
* **Contacto (`/contacto`):** Botón flotante de canalización a WhatsApp Business y mapa georreferenciado con Google Maps.

### 🔐 Custom CMS / Panel Administrativo (`/admin`)
* **Seguridad:** Control de acceso basado en roles (RBAC) con autenticación mediante Supabase Auth.
* **Operaciones CRUD:** Interfaz gráfica para que la rectoría gestione eventos, noticias del blog, actualización de métricas del portal y reemplazo de documentos PDF institucionales sin requerir conocimientos de programación.

---

## 🛠️ Metodología de Desarrollo

El desarrollo se gestionó mediante el marco **Scrumban** dividido en tres fases principales:

1. **Fase I (Análisis y Diseño):** Levantamiento de requerimientos (6 RQF, 4 RQNF), modelado ER en PostgreSQL y prototipado interactivo UI/UX de alta fidelidad en Figma.
2. **Fase II (Desarrollo Full Stack):** Construcción del Frontend responsivo, maquetación de vistas pedagógicas y desarrollo del CMS privado conectado a Supabase.
3. **Fase III (Integración y Despliegue):** Conexión de API externas (Google Maps, WhatsApp), optimización QA de rendimiento y despliegue continuo en Heliohost.

---

## ⚙️ Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone (https://github.com/SantiRubioR/Jard-nInfantilSemillero.git)
   