import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllStandards, getStandardBySlug } from "@/lib/content";
import { FAMILY_LABELS } from "@/types/standard";

interface PageProps {
  params: { slug: string };
}

/** Genera una ruta estática por cada norma del catálogo. */
export function generateStaticParams(): { slug: string }[] {
  return getAllStandards().map((s) => ({ slug: s.slug }));
}

/** Metadatos por norma: 'codigo - titulo'. */
export function generateMetadata({ params }: PageProps): Metadata {
  const std = getStandardBySlug(params.slug);
  if (!std) {
    return { title: "Norma no encontrada" };
  }
  return {
    title: `${std.codigo} - ${std.titulo}`,
    description: std.objetivo,
  };
}

export default function NormaPage({ params }: PageProps) {
  const std = getStandardBySlug(params.slug);
  if (!std) {
    notFound();
  }

  // Navegación anterior/siguiente a través del catálogo ordenado.
  const all = getAllStandards();
  const index = all.findIndex((s) => s.slug === std.slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <article>
      <header className="not-prose mb-8 border-b border-sky/60 pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-lavender px-3 py-1 text-xs font-bold text-ink">
            {FAMILY_LABELS[std.familia]}
          </span>
          <span className="inline-flex items-center rounded-full bg-peach px-3 py-1 text-xs font-medium text-ink">
            Contenido sintético de ejemplo
          </span>
        </div>
        <p className="text-sm font-bold uppercase tracking-wide text-ink/50">
          {std.codigo}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ink">{std.titulo}</h1>
      </header>

      <div className="prose-niif">
        <section>
          <h2>Objetivo</h2>
          <p>{std.objetivo}</p>
        </section>

        <section>
          <h2>Alcance</h2>
          <p>{std.alcance}</p>
        </section>

        {std.secciones.map((seccion) => (
          <section key={seccion.id} id={seccion.id}>
            <h2>{seccion.titulo}</h2>
            {seccion.parrafos.map((parrafo) => (
              <p key={parrafo.id} id={parrafo.id}>
                <span className="mr-2 font-semibold text-ink/70">
                  {parrafo.numero}
                </span>
                {parrafo.texto}
              </p>
            ))}
          </section>
        ))}
      </div>

      <nav
        aria-label="Navegación entre normas"
        className="not-prose mt-10 flex flex-col gap-3 border-t border-sky/60 pt-6 sm:flex-row sm:justify-between"
      >
        {prev ? (
          <Link
            href={`/norma/${prev.slug}`}
            className="flex-1 rounded-lg bg-mint/40 p-3 text-left ring-1 ring-mint transition hover:bg-mint/70"
          >
            <span className="block text-xs text-ink/50">← Anterior</span>
            <span className="block text-sm font-medium text-ink">
              {prev.codigo} · {prev.titulo}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/norma/${next.slug}`}
            className="flex-1 rounded-lg bg-mint/40 p-3 text-right ring-1 ring-mint transition hover:bg-mint/70"
          >
            <span className="block text-xs text-ink/50">Siguiente →</span>
            <span className="block text-sm font-medium text-ink">
              {next.codigo} · {next.titulo}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  );
}
