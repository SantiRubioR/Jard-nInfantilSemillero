import { expect, test } from "@playwright/test";

test.describe("sitio público", () => {
  test("inicio carga con hero y secciones principales", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /educando con amor y conocimiento/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/matrículas 2027 abiertas/i)).toBeVisible();
  });

  test("navegación principal funciona", async ({ page }) => {
    await page.goto("/");

    for (const route of ["/educacion/", "/nosotros/", "/blog/", "/contacto/"]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("educación muestra los niveles", async ({ page }) => {
    await page.goto("/educacion/");
    await expect(
      page.getByRole("heading", { level: 1, name: /niveles educativos/i }),
    ).toBeVisible();
    await expect(page.getByText("Prejardín", { exact: true })).toBeVisible();
  });

  test("blog muestra publicaciones y detalle por query string", async ({ page }) => {
    await page.goto("/blog/");
    await expect(
      page.getByRole("heading", { level: 1, name: /novedades y eventos/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /día del niño y la niña 2026/i,
      }),
    ).toBeVisible();

    await page.goto("/blog/?slug=dia-del-nino-y-la-nina-2026");
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /día del niño y la niña 2026/i,
      }),
    ).toBeVisible();
  });

  test("detalle estático del blog funciona", async ({ page }) => {
    await page.goto("/blog/dia-del-nino-y-la-nina-2026/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /día del niño y la niña 2026/i,
      }),
    ).toBeVisible();
  });
});

test.describe("panel administrativo en modo demostración", () => {
  test("login muestra el formulario y el acceso demo", async ({ page }) => {
    await page.goto("/admin/login/");
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /explorar el panel/i })).toBeVisible();
  });

  test("dashboard demo carga sin sesión", async ({ page }) => {
    await page.goto("/admin/");
    await expect(
      page.getByRole("heading", { level: 1, name: /resumen del panel/i }),
    ).toBeVisible();
    await expect(page.getByText(/modo demostración/i).first()).toBeVisible();
  });

  test("módulos del panel demo cargan", async ({ page }) => {
    for (const [route, heading] of [
      ["/admin/blog/", /blog y circulares/i],
      ["/admin/educacion/", /temarios pedagógicos/i],
      ["/admin/estadisticas/", /estadísticas de inicio/i],
      ["/admin/nosotros/", /^nosotros$/i],
    ] as const) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    }
  });
});
