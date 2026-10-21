import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-prose rounded-2xl bg-lavender/30 p-8 text-center ring-1 ring-lavender">
      <p className="text-5xl" aria-hidden>
        📄
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">
        Página no encontrada
      </h1>
      <p className="mt-2 text-ink/70">
        La norma o la página que buscas no existe o aún no está disponible.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-cream shadow-sm transition hover:bg-ink/90"
        >
          Volver al inicio
        </Link>
        <Link
          href="/buscar"
          className="rounded-lg bg-peach px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-peach/80"
        >
          Buscar una norma
        </Link>
      </div>
    </section>
  );
}
