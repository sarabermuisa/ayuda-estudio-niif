export default function Loading() {
  return (
    <div
      className="not-prose space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Cargando contenido"
    >
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-lavender/60" />
      <div className="h-4 w-full animate-pulse rounded bg-sky/50" />
      <div className="h-4 w-11/12 animate-pulse rounded bg-sky/50" />
      <div className="h-4 w-10/12 animate-pulse rounded bg-sky/50" />
      <div className="mt-6 h-6 w-1/3 animate-pulse rounded-lg bg-mint/60" />
      <div className="h-4 w-full animate-pulse rounded bg-sky/50" />
      <div className="h-4 w-9/12 animate-pulse rounded bg-sky/50" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
