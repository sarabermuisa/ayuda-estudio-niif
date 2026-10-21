import Link from "next/link";
import { getStandardsByFamily, FAMILY_ORDER } from "@/lib/content";
import { FAMILY_LABELS, type Family } from "@/types/standard";

/**
 * Acento pastel por familia. Cada familia usa un color del tema para que el
 * catálogo sea fácil de escanear visualmente.
 */
const FAMILY_ACCENT: Record<
  Family,
  { chip: string; card: string; ring: string }
> = {
  IFRS: {
    chip: "bg-lavender text-ink",
    card: "bg-lavender/30 hover:bg-lavender/60",
    ring: "ring-lavender",
  },
  IAS: {
    chip: "bg-mint text-ink",
    card: "bg-mint/30 hover:bg-mint/60",
    ring: "ring-mint",
  },
  IFRIC: {
    chip: "bg-peach text-ink",
    card: "bg-peach/30 hover:bg-peach/60",
    ring: "ring-peach",
  },
  SIC: {
    chip: "bg-sky text-ink",
    card: "bg-sky/30 hover:bg-sky/60",
    ring: "ring-sky",
  },
};

export default function HomePage() {
  const grouped = getStandardsByFamily();
  const total = FAMILY_ORDER.reduce((n, f) => n + grouped[f].length, 0);

  return (
    <section>
      <h1>Lector de NIIF</h1>
      <p>
        Explora las Normas Internacionales de Información Financiera
        (NIIF/IFRS, NIC/IAS, CINIIF/IFRIC y SIC). Usa el índice de la izquierda
        o la búsqueda para encontrar una norma concreta. Actualmente hay{" "}
        <strong>{total}</strong> {total === 1 ? "norma disponible" : "normas disponibles"}.
      </p>

      <div className="not-prose my-6 rounded-xl bg-peach/40 p-4 ring-1 ring-peach">
        <p className="mb-3 text-sm text-ink/80">
          ¿Buscas algo concreto? Usa el buscador para encontrar texto en
          cualquier norma.
        </p>
        <Link
          href="/buscar"
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-cream shadow-sm transition hover:bg-ink/90"
        >
          <span aria-hidden>🔍</span>
          Ir al buscador
        </Link>
      </div>

      <p className="rounded-lg bg-lavender/30 px-3 py-2 text-sm text-ink/70">
        Nota: todo el contenido es <strong>sintético y de ejemplo</strong>. Está
        preparado para reemplazarse por el texto oficial de los PDFs de las
        normas.
      </p>

      {FAMILY_ORDER.map((familia) => {
        const items = grouped[familia];
        if (items.length === 0) return null;
        const accent = FAMILY_ACCENT[familia];
        return (
          <section key={familia} className="not-prose mt-10">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold text-ink">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${accent.chip}`}
              >
                {FAMILY_LABELS[familia]}
              </span>
              <span className="text-sm font-normal text-ink/50">
                {items.length} {items.length === 1 ? "norma" : "normas"}
              </span>
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((std) => (
                <li key={std.slug}>
                  <Link
                    href={`/norma/${std.slug}`}
                    className={`block h-full rounded-xl p-4 shadow-sm ring-1 transition ${accent.card} ${accent.ring}`}
                  >
                    <span className="block text-sm font-bold text-ink">
                      {std.codigo}
                    </span>
                    <span className="mt-1 block text-sm text-ink/70">
                      {std.titulo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
