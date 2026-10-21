"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import type { SearchRecord } from "@/lib/content";

interface SearchBoxProps {
  /** Registros aplanados (granularidad de párrafo) para indexar. */
  records: SearchRecord[];
}

/** Resalta los tramos coincidentes de `texto` devueltos por Fuse. */
function highlight(
  texto: string,
  matches: readonly FuseResultMatch[] | undefined,
): React.ReactNode {
  const textoMatch = matches?.find((m) => m.key === "texto");
  const indices = textoMatch?.indices;
  if (!indices || indices.length === 0) return texto;

  // Fusiona y ordena los rangos para construir el fragmento resaltado.
  const ranges = [...indices].sort((a, b) => a[0] - b[0]);
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([start, end], i) => {
    if (start < cursor) return;
    if (start > cursor) nodes.push(texto.slice(cursor, start));
    nodes.push(
      <mark key={i} className="rounded bg-peach px-0.5 text-ink">
        {texto.slice(start, end + 1)}
      </mark>,
    );
    cursor = end + 1;
  });
  if (cursor < texto.length) nodes.push(texto.slice(cursor));
  return nodes;
}

const MAX_RESULTS = 40;

export default function SearchBox({ records }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Índice Fuse construido una sola vez sobre los registros.
  const fuse = useMemo(
    () =>
      new Fuse(records, {
        keys: [
          { name: "titulo", weight: 3 },
          { name: "codigo", weight: 2 },
          { name: "texto", weight: 1 },
        ],
        includeMatches: true,
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [records],
  );

  // Debounce de la entrada para no recalcular en cada pulsación.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(query.trim()), 200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const results = useMemo(() => {
    if (debounced.length < 2) return [];
    return fuse.search(debounced).slice(0, MAX_RESULTS);
  }, [debounced, fuse]);

  return (
    <div className="not-prose">
      <label htmlFor="niif-search" className="sr-only">
        Buscar en las normas
      </label>
      <input
        id="niif-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por código, título o texto… (p. ej. «arrendamientos», «NIIF 15»)"
        autoComplete="off"
        className="w-full rounded-xl border border-sky bg-white px-4 py-3 text-ink shadow-sm outline-none ring-sky transition focus:ring-2"
      />

      {debounced.length < 2 ? (
        <p className="mt-6 rounded-lg bg-lavender/30 px-4 py-3 text-sm text-ink/70">
          Escribe al menos dos caracteres para buscar en todas las normas. La
          búsqueda se ejecuta íntegramente en tu navegador.
        </p>
      ) : results.length === 0 ? (
        <p className="mt-6 rounded-lg bg-peach/30 px-4 py-3 text-sm text-ink/70">
          No se encontraron resultados para <strong>«{debounced}»</strong>.
          Prueba con otros términos.
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm text-ink/50">
            {results.length === MAX_RESULTS
              ? `Mostrando los primeros ${MAX_RESULTS} resultados`
              : `${results.length} resultado${results.length === 1 ? "" : "s"}`}
          </p>
          <ul className="mt-3 space-y-3">
            {results.map(({ item, matches }) => (
              <li key={item.path}>
                <Link
                  href={`/norma/${item.path}`}
                  className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-sky/60 transition hover:ring-sky"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-lavender px-2 py-0.5 font-bold text-ink">
                      {item.codigo}
                    </span>
                    <span className="text-ink/50">{item.familiaLabel}</span>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {item.titulo}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {item.seccion} · párrafo {item.numero}
                  </p>
                  <p className="mt-2 text-sm text-ink/80">
                    {highlight(item.texto, matches)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
