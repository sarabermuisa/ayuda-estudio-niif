/**
 * Modelo de datos del contenido de las normas (NIIF/IFRS, NIC/IAS, CINIIF/IFRIC, SIC).
 *
 * Estos tipos describen el CONTENIDO almacenado en src/content/*.json y son
 * independientes de los tipos de la barra lateral (ver src/components/Sidebar.tsx,
 * que exporta SidebarItem/SidebarGroup para la interfaz de usuario).
 */

/** Familia normativa a la que pertenece una norma. */
export type Family = "IFRS" | "IAS" | "IFRIC" | "SIC";

/** Un párrafo individual dentro de una sección. */
export interface Paragraph {
  /** Identificador estable y único dentro de la norma, p. ej. 's1-p2'. */
  id: string;
  /** Número o etiqueta del párrafo tal como se mostraría, p. ej. '1.2'. */
  numero: string;
  /** Texto del párrafo (sintético/placeholder por ahora). */
  texto: string;
}

/** Una sección de una norma, compuesta por varios párrafos. */
export interface Section {
  /** Identificador estable y único dentro de la norma, p. ej. 's1'. */
  id: string;
  /** Título de la sección. */
  titulo: string;
  /** Párrafos que componen la sección. */
  parrafos: Paragraph[];
}

/** Una norma completa con su cuerpo sintético. */
export interface Standard {
  /** Slug URL-safe y estable, p. ej. 'niif-15', 'nic-1', 'ciniif-23', 'sic-32'. */
  slug: string;
  /** Familia normativa. */
  familia: Family;
  /** Número oficial de la norma. */
  numero: number;
  /** Código legible, p. ej. 'NIIF 15' / 'NIC 1' / 'CINIIF 23' / 'SIC 32'. */
  codigo: string;
  /** Título oficial en español. */
  titulo: string;
  /** Objetivo de la norma (texto sintético). */
  objetivo: string;
  /** Alcance de la norma (texto sintético). */
  alcance: string;
  /** Secciones con su contenido. */
  secciones: Section[];
  /** Marca que el cuerpo es contenido sintético/de ejemplo. */
  sintetico: true;
}

/** Etiquetas legibles por familia, usadas en la navegación y encabezados. */
export const FAMILY_LABELS: Record<Family, string> = {
  IFRS: "NIIF / IFRS",
  IAS: "NIC / IAS",
  IFRIC: "CINIIF / IFRIC",
  SIC: "SIC",
};
