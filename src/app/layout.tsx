import type { Metadata } from "next";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getSidebarGroups } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lector de NIIF",
  description:
    "Lector de las Normas Internacionales de Información Financiera (NIIF/IFRS, NIC/IAS, CINIIF/IFRIC y SIC) con navegación por familia y búsqueda.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarGroups = getSidebarGroups();

  return (
    <html lang="es">
      <body className="min-h-screen bg-cream text-ink">
        <header className="sticky top-0 z-10 border-b border-sky/60 bg-lavender/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold text-ink">
              Lector de NIIF
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/buscar"
                className="rounded-lg bg-peach px-3 py-1.5 font-medium text-ink shadow-sm transition hover:bg-peach/80"
              >
                Buscar
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:py-8">
          <aside className="md:sticky md:top-20 md:self-start">
            <Sidebar groups={sidebarGroups} />
          </aside>

          <main className="min-w-0 flex-1">
            <div className="prose-niif mx-auto">{children}</div>
          </main>
        </div>

        <footer className="border-t border-sky/60 bg-white/50">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-ink/50">
            Contenido de ejemplo. Reemplaza el texto sintético por el texto real
            de las normas cuando esté disponible.
          </div>
        </footer>
      </body>
    </html>
  );
}
