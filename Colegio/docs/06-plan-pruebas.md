# Plan de pruebas

## Objetivo

Verificar el cumplimiento de los requerimientos funcionales y no funcionales del proyecto, así como la estabilidad del despliegue en producción.

## Estado actual de la entrega

| Verificación | Resultado |
|---|---|
| `npm run typecheck` | ✅ Sin errores |
| `npm run lint` | ✅ Sin errores |
| `npm run test` | ✅ 44 pruebas unitarias (Vitest, patrón AAA) |
| `npm run arch:check` | ✅ 0 violaciones de arquitectura simple |
| `npm run build` | ✅ Exportación estática exitosa (`out/`, 22 rutas) |
| `npm run test:e2e` | ✅ 8 pruebas Playwright (rutas públicas y panel demo) |
| Rutas públicas `/`, `/educacion/`, `/nosotros/`, `/blog/`, `/contacto/` | ✅ HTTP 200 sirviendo `out/` con Python |
| Rutas del panel `/admin/*/` | ✅ HTTP 200 en modo demostración |
| Lighthouse (build estático) | ✅ Performance 75 · Accessibility 100 · Best Practices 100 · SEO 100 |
| Pruebas con Supabase real | ⏳ Pendiente de configurar credenciales en el build |
| Pruebas de RLS | ⏳ Pendiente de ejecutar en Supabase |

## Pruebas unitarias (AAA)

Las pruebas de servicios usan el patrón **Arrange – Act – Assert** y repositorios falsos:

```ts
it("crea un evento con imagen, slug y autor", async () => {
  // Arrange
  const repository = makeBlogRepository();
  const storage = makeStorage();
  const deps = { repository, storage, getCurrentUserId: async () => ok("user-1") };

  // Act
  const result = await createPost(input, deps);

  // Assert
  expect(result.ok).toBe(true);
  expect(repository.created?.createdBy).toBe("user-1");
});
```

No se necesita Supabase real para estas pruebas.

## 1. Pruebas funcionales

| ID | Requerimiento | Caso | Pasos | Resultado esperado |
|---|---|---|---|---|
| PF-01 | RQF001 | Navegación pública | Abrir `/`, `/educacion/`, `/nosotros/`, `/blog/`, `/contacto/` | Todas cargan sin autenticación y son responsive |
| PF-02 | RQF001 | Descarga de PDF | En `/educacion/`, abrir un nivel con PDF y hacer clic en Descargar | Se descarga o abre el PDF |
| PF-03 | RQF002 | Crear evento | Login → Blog → completar formulario con imagen → Agregar | La publicación aparece en `/blog/` |
| PF-04 | RQF002 | Crear circular | Login → Blog → categoría Circular → adjuntar PDF | La circular aparece en `/blog/?slug=...` y su PDF se descarga |
| PF-05 | RQF003 | Editar publicación | Blog → Editar → cambiar título → Guardar | El cambio se ve en el sitio sin reiniciar |
| PF-06 | RQF004 | Eliminar publicación | Blog → Eliminar → confirmar | Desaparece del panel y del sitio; se borran sus archivos |
| PF-07 | RQF005 | WhatsApp | Clic en el botón flotante | Abre WhatsApp con el mensaje “Estoy interesado…” |
| PF-08 | RQF006 | Mapa | Abrir `/contacto/` | Se muestra el mapa de la ubicación del jardín |
| PF-09 | — | Estadísticas | Login → Estadísticas → cambiar valores → Guardar | La franja de inicio muestra los nuevos valores |
| PF-10 | — | Temario | Login → Temarios → subir PDF | El botón de descarga del nivel queda activo |
| PF-11 | — | Galería | Login → Nosotros → subir imagen | La imagen aparece en la galería pública |
| PF-12 | — | Eliminar imagen | Nosotros → Eliminar | La imagen desaparece y se borra de Storage |

## 2. Pruebas de seguridad

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| PS-01 | Acceso sin sesión | Abrir `/admin/` en ventana privada | Redirige a `/admin/login` |
| PS-02 | Login inválido | Ingresar correo/contraseña incorrectos | Mensaje genérico, sin filtrar datos |
| PS-03 | Escritura anónima | `set role anon; insert into statistics...` | Falla por RLS |
| PS-04 | Lectura de borradores | Publicar borrador y consultar `/blog/` con la clave anónima | No aparece |
| PS-05 | Archivo inválido | Subir `.exe` o un PDF de más de 10 MB desde el panel | Se rechaza con mensaje claro |
| PS-06 | Storage anónimo | Intentar subir con la clave anónima | Falla por políticas de Storage |
| PS-07 | Secretos | Revisar el bundle del cliente | No aparece `service_role` |
| PS-08 | Keepalive externo | Configurar UptimeRobot contra Supabase REST | Responde 200 y mantiene activa la BD |

## 3. Pruebas no funcionales

### Rendimiento y accesibilidad (RQNF002)

Ejecutar Lighthouse en Chrome DevTools sobre la URL de producción:

| Categoría | Mínimo | Meta |
|---|---|---|
| Performance | 70 | 85–95 |
| Accessibility | 70 | 90–100 |
| Best Practices | 70 | 90–100 |
| SEO | — | 90–100 |

Revisar también:

- Imágenes con `alt`.
- Contraste de texto (especialmente azul sobre amarillo).
- Navegación completa con teclado.
- Foco visible en botones y enlaces.
- `prefers-reduced-motion`.
- Formularios con `label` asociado.

### Responsive

Probar en:

| Ancho | Dispositivo |
|---|---|
| 360 px | Móvil pequeño |
| 390 px | iPhone |
| 768 px | Tablet |
| 1024 px | Laptop |
| 1440 px | Escritorio |

Verificar header móvil, menú del panel, tablas, tarjetas y galería.

### Compatibilidad

- Chrome / Edge (últimas 2 versiones).
- Firefox.
- Safari (macOS e iOS).
- Android Chrome.

## 4. Pruebas de contenido y UX (RQNF004)

| ID | Caso | Resultado esperado |
|---|---|---|
| PU-01 | Prototipo vs. interfaz | Colores, tipografía y estructura coinciden con el prototipo de Figma |
| PU-02 | Textos institucionales | Historia, misión, visión y modelo pedagógico coinciden con el A1 |
| PU-03 | Navegación | Ningún enlace interno lleva a 404 |
| PU-04 | Mensajes vacíos | Blog sin publicaciones y galería vacía muestran un estado claro |
| PU-05 | Mensajes de error | Los formularios muestran errores comprensibles |
| PU-06 | Confirmación de borrado | Se solicita confirmación antes de eliminar |

## 5. Pruebas de aceptación con la rectora (UAT)

1. Agendar una sesión de 30 minutos con la rectora.
2. Mostrar el sitio público en móvil y escritorio.
3. Pedirle que cree una publicación, suba un temario y actualice una estadística.
4. Registrar observaciones en una tabla: fecha, observación, severidad, responsable, estado.
5. Corregir los hallazgos y repetir la prueba.
6. Firmar el acta de aceptación.

## 6. Evidencias

Guardar en `docs/evidencias/`:

- Capturas de las rutas públicas y del panel.
- Captura del reporte Lighthouse.
- Captura de la prueba de RLS.
- Video corto del flujo de creación de una publicación.
- Acta de aceptación firmada.
- Registro de la prueba de carga del PDF y de la imagen.

## 7. Criterios de salida

La entrega se considera lista cuando:

- [ ] Todos los casos PF-01 a PF-12 pasan.
- [ ] Todos los casos PS-01 a PS-08 pasan.
- [ ] Lighthouse ≥ 70 en rendimiento, accesibilidad y buenas prácticas.
- [ ] No hay errores en consola en las rutas principales.
- [ ] El build de producción compila sin advertencias críticas.
- [ ] El cron responde correctamente.
- [ ] La rectora aprueba la UAT.
- [ ] Los manuales están actualizados.
