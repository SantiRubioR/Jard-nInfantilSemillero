import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Ibagué`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "jardín infantil",
    "Ibagué",
    "educación inicial",
    "Semillero",
    "preescolar",
    "primaria",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Ibagué`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Ibagué`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface text-foreground">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
