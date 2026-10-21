import type { Family, Standard } from "@/types/standard";
import { FAMILY_LABELS } from "@/types/standard";

import ifrs from "@/content/ifrs.json";
import ias from "@/content/ias.json";
import ifric from "@/content/ifric.json";
import sic from "@/content/sic.json";

/**
 * Todas las normas concatenadas. Los JSON se importan como módulos (Next.js
 * tiene `resolveJsonModule` habilitado en tsconfig). Se afirma el tipo porque
 * TypeScript infiere los literales JSON de forma amplia.
 */
const ALL_STANDARDS: Standard[] = [
  ...(ifrs as Standard[]),
  ...(ias as Standard[]),
  ...(ifric as Standard[]),
  ...(sic as Standard[]),
];

/** Orden canónico de las familias para la navegación. */
export const FAMILY_ORDER: Family[] = ["IFRS", "IAS", "IFRIC", "SIC"];

/** Devuelve todas las normas (ordenadas por familia y número). */
export function getAllStandards(): Standard[] {
  return [...ALL_STANDARDS].sort((a, b) => {
    const fam = FAMILY_ORDER.indexOf(a.familia) - FAMILY_ORDER.indexOf(b.familia);
    if (fam !== 0) return fam;
    return a.numero - b.numero;
  });
}

/** Busca una norma por su slug; devuelve undefined si no existe. */
export function getStandardBySlug(slug: string): Standard | undefined {
  return ALL_STANDARDS.find((s) => s.slug === slug);
}

/** Agrupa las normas por familia, respetando el orden canónico. */
export function getStandardsByFamily(): Record<Family, Standard[]> {
  const grouped: Record<Family, Standard[]> = {
    IFRS: [],
    IAS: [],
    IFRIC: [],
    SIC: [],
  };
  for (const std of ALL_STANDARDS) {
    grouped[std.familia].push(std);
  }
  for (const familia of FAMILY_ORDER) {
    grouped[familia].sort((a, b) => a.numero - b.numero);
  }
  return grouped;
}

/**
 * Construye los grupos serializables para la barra lateral (un grupo por
 * familia, en orden canónico). Se usa desde layout.tsx (Server Component) para
 * pasar props planas al componente cliente Sidebar.
 */
export function getSidebarGroups(): {
  id: string;
  label: string;
  items: { slug: string; code: string; title: string }[];
}[] {
  const grouped = getStandardsByFamily();
  const idByFamily: Record<Family, string> = {
    IFRS: "niif",
    IAS: "nic",
    IFRIC: "ciniif",
    SIC: "sic",
  };
  return FAMILY_ORDER.map((familia) => ({
    id: idByFamily[familia],
    label: FAMILY_LABELS[familia],
    items: grouped[familia].map((s) => ({
      slug: s.slug,
      code: s.codigo,
      title: s.titulo,
    })),
  }));
}

/** Registro aplanado a nivel de párrafo para indexar con Fuse.js. */
export interface SearchRecord {
  slug: string;
  codigo: string;
  titulo: string;
  familia: Family;
  familiaLabel: string;
  /** Ruta profunda hacia la norma/sección/párrafo. */
  path: string;
  /** Título de la sección que contiene el párrafo. */
  seccion: string;
  /** Número del párrafo dentro de la norma. */
  numero: string;
  /** Fragmento corto para mostrar en los resultados. */
  snippet: string;
  /** Texto completo del párrafo (campo principal de búsqueda). */
  texto: string;
}

/** Longitud máxima del fragmento mostrado en resultados de búsqueda. */
const SNIPPET_LENGTH = 160;

function buildSnippet(texto: string): string {
  const trimmed = texto.trim();
  if (trimmed.length <= SNIPPET_LENGTH) return trimmed;
  return trimmed.slice(0, SNIPPET_LENGTH).trimEnd() + "…";
}

/**
 * Aplana todas las normas a registros con granularidad de párrafo, listos para
 * indexar con Fuse.js. Incluye también el código y el título de la norma para
 * permitir coincidencias por encabezado.
 */
export function flattenForSearch(): SearchRecord[] {
  const records: SearchRecord[] = [];
  for (const std of ALL_STANDARDS) {
    for (const seccion of std.secciones) {
      for (const parrafo of seccion.parrafos) {
        records.push({
          slug: std.slug,
          codigo: std.codigo,
          titulo: std.titulo,
          familia: std.familia,
          familiaLabel: FAMILY_LABELS[std.familia],
          path: `${std.slug}#${parrafo.id}`,
          seccion: seccion.titulo,
          numero: parrafo.numero,
          snippet: buildSnippet(parrafo.texto),
          texto: parrafo.texto,
        });
      }
    }
  }
  return records;
}
