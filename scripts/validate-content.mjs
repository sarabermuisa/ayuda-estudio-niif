// @ts-nocheck
/**
 * Validador offline del contenido de las normas (sin dependencias).
 *
 * Lee los cuatro archivos JSON de src/content/ y verifica:
 *  - cada archivo es un array no vacío,
 *  - cada norma tiene slug único (global),
 *  - codigo/titulo/objetivo/alcance no vacíos,
 *  - al menos una sección con al menos un párrafo,
 *  - familia válida (IFRS | IAS | IFRIC | SIC).
 *
 * Imprime los conteos por familia y termina con código distinto de cero si
 * encuentra algún error.
 *
 * Uso: node scripts/validate-content.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content");

const FILES = {
  IFRS: "ifrs.json",
  IAS: "ias.json",
  IFRIC: "ifric.json",
  SIC: "sic.json",
};

const ALLOWED_FAMILIES = new Set(["IFRS", "IAS", "IFRIC", "SIC"]);

const errors = [];
const counts = {};
const seenSlugs = new Map(); // slug -> fuente (archivo)

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function readJson(fileName) {
  const path = join(CONTENT_DIR, fileName);
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw);
}

for (const [familia, fileName] of Object.entries(FILES)) {
  let data;
  try {
    data = readJson(fileName);
  } catch (err) {
    errors.push(`${fileName}: no se pudo leer/parsear JSON (${err.message})`);
    continue;
  }

  if (!Array.isArray(data) || data.length === 0) {
    errors.push(`${fileName}: debe ser un array no vacío`);
    continue;
  }

  counts[familia] = data.length;

  data.forEach((std, idx) => {
    const where = `${fileName}[${idx}]`;

    if (!isNonEmptyString(std.slug)) {
      errors.push(`${where}: 'slug' vacío o ausente`);
    } else {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(std.slug)) {
        errors.push(`${where}: slug '${std.slug}' no es URL-safe`);
      }
      if (seenSlugs.has(std.slug)) {
        errors.push(
          `${where}: slug duplicado '${std.slug}' (también en ${seenSlugs.get(std.slug)})`
        );
      } else {
        seenSlugs.set(std.slug, where);
      }
    }

    if (!ALLOWED_FAMILIES.has(std.familia)) {
      errors.push(`${where}: familia inválida '${std.familia}'`);
    } else if (std.familia !== familia) {
      errors.push(
        `${where}: familia '${std.familia}' no coincide con el archivo (${familia})`
      );
    }

    if (typeof std.numero !== "number" || !Number.isFinite(std.numero)) {
      errors.push(`${where}: 'numero' debe ser un número`);
    }

    for (const field of ["codigo", "titulo", "objetivo", "alcance"]) {
      if (!isNonEmptyString(std[field])) {
        errors.push(`${where}: '${field}' vacío o ausente`);
      }
    }

    if (std.sintetico !== true) {
      errors.push(`${where}: 'sintetico' debe ser true`);
    }

    if (!Array.isArray(std.secciones) || std.secciones.length === 0) {
      errors.push(`${where}: debe tener al menos una sección`);
    } else {
      let hasParrafo = false;
      std.secciones.forEach((sec, sIdx) => {
        const secWhere = `${where}.secciones[${sIdx}]`;
        if (!isNonEmptyString(sec.id)) {
          errors.push(`${secWhere}: 'id' vacío o ausente`);
        }
        if (!isNonEmptyString(sec.titulo)) {
          errors.push(`${secWhere}: 'titulo' vacío o ausente`);
        }
        if (!Array.isArray(sec.parrafos) || sec.parrafos.length === 0) {
          errors.push(`${secWhere}: debe tener al menos un párrafo`);
        } else {
          hasParrafo = true;
          sec.parrafos.forEach((p, pIdx) => {
            const pWhere = `${secWhere}.parrafos[${pIdx}]`;
            if (!isNonEmptyString(p.id)) {
              errors.push(`${pWhere}: 'id' vacío o ausente`);
            }
            if (!isNonEmptyString(p.numero)) {
              errors.push(`${pWhere}: 'numero' vacío o ausente`);
            }
            if (!isNonEmptyString(p.texto)) {
              errors.push(`${pWhere}: 'texto' vacío o ausente`);
            }
          });
        }
      });
      if (!hasParrafo) {
        errors.push(`${where}: ninguna sección contiene párrafos`);
      }
    }
  });
}

console.log("Conteos por familia:");
for (const familia of Object.keys(FILES)) {
  console.log(`  ${familia}: ${counts[familia] ?? 0}`);
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`  TOTAL: ${total}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(es) de validación:`);
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log("\nValidación correcta: todo el contenido es estructuralmente válido.");
