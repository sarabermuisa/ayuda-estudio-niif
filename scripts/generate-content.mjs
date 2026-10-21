// @ts-nocheck
/**
 * Generador bootstrap del contenido de las normas.
 *
 * Mantiene un catálogo compacto (número -> título oficial en español por familia)
 * y emite los cuatro archivos JSON en src/content/ con un cuerpo sintético uniforme.
 *
 * Uso:
 *   node scripts/generate-content.mjs
 *
 * IMPORTANTE: el JSON generado es la FUENTE DE VERDAD editable. Este script es
 * solo una conveniencia de arranque para (re)generar un primer borrador. Una vez
 * reemplazado el texto sintético por el texto real de las normas, no vuelvas a
 * ejecutar el generador salvo que quieras descartar esas ediciones.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content");

/** Prefijo de código legible por familia. */
const CODE_PREFIX = {
  IFRS: "NIIF",
  IAS: "NIC",
  IFRIC: "CINIIF",
  SIC: "SIC",
};

/** Prefijo de slug por familia (URL-safe). */
const SLUG_PREFIX = {
  IFRS: "niif",
  IAS: "nic",
  IFRIC: "ciniif",
  SIC: "sic",
};

/** Nombre de archivo por familia. */
const FILE_NAME = {
  IFRS: "ifrs.json",
  IAS: "ias.json",
  IFRIC: "ifric.json",
  SIC: "sic.json",
};

/** Etiqueta legible por familia (para el texto sintético). */
const FAMILY_LABEL = {
  IFRS: "NIIF / IFRS",
  IAS: "NIC / IAS",
  IFRIC: "CINIIF / IFRIC",
  SIC: "SIC",
};

// --- Catálogo compacto: número -> título oficial en español --------------

const CATALOG = {
  IFRS: {
    1: "Adopción por primera vez de las NIIF",
    2: "Pagos basados en acciones",
    3: "Combinaciones de negocios",
    4: "Contratos de seguro",
    5: "Activos no corrientes mantenidos para la venta y operaciones discontinuadas",
    6: "Exploración y evaluación de recursos minerales",
    7: "Instrumentos financieros: Información a revelar",
    8: "Segmentos de operación",
    9: "Instrumentos financieros",
    10: "Estados financieros consolidados",
    11: "Acuerdos conjuntos",
    12: "Información a revelar sobre participaciones en otras entidades",
    13: "Medición del valor razonable",
    14: "Cuentas de diferimientos de actividades reguladas",
    15: "Ingresos de actividades ordinarias procedentes de contratos con clientes",
    16: "Arrendamientos",
    17: "Contratos de seguro",
    18: "Presentación e información a revelar en los estados financieros",
  },
  IAS: {
    1: "Presentación de estados financieros",
    2: "Inventarios",
    7: "Estado de flujos de efectivo",
    8: "Políticas contables, cambios en las estimaciones contables y errores",
    10: "Hechos ocurridos después del periodo sobre el que se informa",
    12: "Impuesto a las ganancias",
    16: "Propiedades, planta y equipo",
    19: "Beneficios a los empleados",
    20: "Contabilización de las subvenciones del gobierno e información a revelar sobre ayudas gubernamentales",
    21: "Efectos de las variaciones en las tasas de cambio de la moneda extranjera",
    23: "Costos por préstamos",
    24: "Información a revelar sobre partes relacionadas",
    26: "Contabilización e información financiera sobre planes de beneficio por retiro",
    27: "Estados financieros separados",
    28: "Inversiones en asociadas y negocios conjuntos",
    29: "Información financiera en economías hiperinflacionarias",
    32: "Instrumentos financieros: Presentación",
    33: "Ganancias por acción",
    34: "Información financiera intermedia",
    36: "Deterioro del valor de los activos",
    37: "Provisiones, pasivos contingentes y activos contingentes",
    38: "Activos intangibles",
    39: "Instrumentos financieros: Reconocimiento y medición",
    40: "Propiedades de inversión",
    41: "Agricultura",
  },
  IFRIC: {
    1: "Cambios en pasivos existentes por desmantelamiento, restauración y similares",
    2: "Aportaciones de socios de entidades cooperativas e instrumentos similares",
    5: "Derechos por la participación en fondos para el retiro del servicio, la restauración y la rehabilitación medioambiental",
    6: "Obligaciones surgidas de la participación en mercados específicos: residuos de aparatos eléctricos y electrónicos",
    7: "Aplicación del procedimiento de reexpresión según la NIC 29 Información financiera en economías hiperinflacionarias",
    10: "Información financiera intermedia y deterioro del valor",
    12: "Acuerdos de concesión de servicios",
    14: "El límite de un activo por beneficios definidos, obligación de mantener un nivel mínimo de financiación y su interacción",
    16: "Coberturas de una inversión neta en un negocio en el extranjero",
    17: "Distribuciones a los propietarios de activos distintos al efectivo",
    19: "Cancelación de pasivos financieros con instrumentos de patrimonio",
    20: "Costos de desmonte en la fase de producción de una mina a cielo abierto",
    21: "Gravámenes",
    22: "Transacciones en moneda extranjera y contraprestaciones anticipadas",
    23: "La incertidumbre frente a los tratamientos del impuesto a las ganancias",
  },
  SIC: {
    7: "Introducción del euro",
    10: "Ayudas gubernamentales: sin relación específica con actividades de operación",
    25: "Impuesto a las ganancias: cambios en la situación fiscal de una entidad o de sus accionistas",
    29: "Acuerdos de concesión de servicios: Información a revelar",
    32: "Activos intangibles: costos de sitios web",
  },
};

// --- Plantilla sintética ---------------------------------------------------

const FAMILIES = ["IFRS", "IAS", "IFRIC", "SIC"];

/** Construye el objetivo sintético. */
function buildObjetivo(codigo, titulo, familia) {
  return (
    `[CONTENIDO DE EJEMPLO] El objetivo de ${codigo} «${titulo}» es ilustrar cómo se ` +
    `presentará el texto normativo dentro del lector. Este resumen sintético describe, de forma ` +
    `genérica, el propósito de la norma y debe reemplazarse por el objetivo oficial cuando se ` +
    `disponga del PDF correspondiente de la familia ${FAMILY_LABEL[familia]}.`
  );
}

/** Construye el alcance sintético. */
function buildAlcance(codigo, titulo) {
  return (
    `[CONTENIDO DE EJEMPLO] ${codigo} se aplicaría, en este texto de muestra, a las entidades y ` +
    `transacciones típicamente relacionadas con «${titulo}». El alcance real, con sus inclusiones ` +
    `y exclusiones, se incorporará al sustituir este marcador por el contenido oficial.`
  );
}

/** Construye las secciones y párrafos sintéticos de una norma. */
function buildSecciones(codigo, titulo) {
  const plantilla = [
    {
      titulo: "Reconocimiento y medición",
      parrafos: [
        `Una entidad reconocería los elementos descritos en ${codigo} cuando sea probable que los ` +
          `beneficios económicos futuros fluyan hacia la entidad y su costo pueda medirse con fiabilidad. ` +
          `(Texto de ejemplo).`,
        `La medición inicial se realizaría al costo o al valor razonable, según corresponda al tratamiento ` +
          `previsto para «${titulo}». Este párrafo es un marcador y no constituye texto oficial.`,
        `Con posterioridad al reconocimiento inicial, la entidad aplicaría el modelo que mejor refleje la ` +
          `realidad económica de la transacción. Reemplazar por el párrafo normativo correspondiente.`,
      ],
    },
    {
      titulo: "Información a revelar",
      parrafos: [
        `La entidad revelaría información que permita a los usuarios de los estados financieros evaluar el ` +
          `efecto de «${titulo}» sobre la situación financiera y el rendimiento. (Texto de ejemplo).`,
        `Las revelaciones incluirían las políticas contables significativas y los juicios aplicados al ` +
          `preparar la información conforme a ${codigo}. Marcador sintético pendiente de sustitución.`,
      ],
    },
    {
      titulo: "Transición y fecha de vigencia",
      parrafos: [
        `Una entidad aplicaría ${codigo} de forma retroactiva o prospectiva según las disposiciones de ` +
          `transición que se definan. Este contenido es ilustrativo y debe actualizarse.`,
        `La fecha de vigencia y las excepciones de transición se precisarán al incorporar el texto oficial ` +
          `de la norma «${titulo}». (Texto de ejemplo).`,
      ],
    },
  ];

  return plantilla.map((sec, sIdx) => {
    const sid = `s${sIdx + 1}`;
    return {
      id: sid,
      titulo: sec.titulo,
      parrafos: sec.parrafos.map((texto, pIdx) => ({
        id: `${sid}-p${pIdx + 1}`,
        numero: `${sIdx + 1}.${pIdx + 1}`,
        texto,
      })),
    };
  });
}

/** Construye un objeto Standard completo. */
function buildStandard(familia, numero, titulo) {
  const codigo = `${CODE_PREFIX[familia]} ${numero}`;
  const slug = `${SLUG_PREFIX[familia]}-${numero}`;
  return {
    slug,
    familia,
    numero,
    codigo,
    titulo,
    objetivo: buildObjetivo(codigo, titulo, familia),
    alcance: buildAlcance(codigo, titulo),
    secciones: buildSecciones(codigo, titulo),
    sintetico: true,
  };
}

// --- Emisión ---------------------------------------------------------------

function main() {
  mkdirSync(CONTENT_DIR, { recursive: true });

  for (const familia of FAMILIES) {
    const numeros = Object.keys(CATALOG[familia])
      .map((n) => Number(n))
      .sort((a, b) => a - b);
    const standards = numeros.map((numero) =>
      buildStandard(familia, numero, CATALOG[familia][numero])
    );
    const outPath = join(CONTENT_DIR, FILE_NAME[familia]);
    writeFileSync(outPath, JSON.stringify(standards, null, 2) + "\n", "utf8");
    console.log(`Escrito ${FILE_NAME[familia]}: ${standards.length} normas`);
  }

  console.log("Generación de contenido completada.");
}

main();
