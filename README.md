# Lector de NIIF

Lector web de las Normas Internacionales de Información Financiera (NIIF/IFRS,
NIC/IAS, CINIIF/IFRIC y SIC), inspirado en el ejercicio de
[niif-estatuto-lector](https://niif-estatuto-lector.vercel.app/). Ofrece:

- Un catálogo completo agrupado por familia (NIIF/IFRS, NIC/IAS, CINIIF/IFRIC, SIC).
- Una vista de lectura tipo libro por norma, en `/norma/[slug]`, con objetivo,
  alcance y secciones con párrafos numerados.
- Búsqueda local en el navegador (sin servidor) sobre el texto de todas las
  normas, con [Fuse.js](https://www.fusejs.io/).
- Una barra lateral navegable y colapsable, responsive, con índice por familia.
- Tema de colores pasteles (lavanda, menta, durazno, cielo).

> **Importante:** todo el contenido incluido es **sintético y de ejemplo**. Está
> diseñado para reemplazarse por el texto oficial de los PDFs de las normas
> cuando esté disponible. Consulta la sección
> [Reemplazar el contenido sintético por los PDFs reales](#reemplazar-el-contenido-sintético-por-los-pdfs-reales).

## Tecnologías

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) con una paleta pastel personalizada
- [Fuse.js](https://www.fusejs.io/) para la búsqueda difusa en el cliente

## Prerrequisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (incluido con Node.js)

## Ejecución local

```bash
npm install
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

| Script             | Descripción                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `npm run dev`      | Inicia el servidor de desarrollo en `http://localhost:3000`.       |
| `npm run build`    | Compila la aplicación para producción.                             |
| `npm run start`    | Sirve la build de producción (requiere `npm run build` antes).     |
| `npm run lint`     | Ejecuta ESLint con la configuración de Next.js.                    |
| `npm run validate` | Valida la integridad del contenido JSON (ver más abajo).           |

## Estructura del proyecto

```
.
├── scripts/
│   ├── generate-content.mjs   # Generador de arranque del contenido de ejemplo
│   └── validate-content.mjs   # Validador offline de la integridad del contenido
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout raíz: cabecera + barra lateral + contenido
│   │   ├── page.tsx           # Inicio: catálogo agrupado por familia
│   │   ├── loading.tsx        # Estado de carga (skeleton pastel)
│   │   ├── not-found.tsx      # Página 404
│   │   ├── buscar/
│   │   │   └── page.tsx       # Página de búsqueda (renderiza SearchBox)
│   │   └── norma/
│   │       └── [slug]/
│   │           └── page.tsx   # Vista de lectura de una norma
│   ├── components/
│   │   ├── Sidebar.tsx        # Índice lateral por familia (cliente, colapsable)
│   │   └── SearchBox.tsx      # Buscador con Fuse.js (cliente)
│   ├── content/
│   │   ├── ifrs.json          # NIIF / IFRS
│   │   ├── ias.json           # NIC / IAS
│   │   ├── ifric.json         # CINIIF / IFRIC
│   │   └── sic.json           # SIC
│   ├── lib/
│   │   └── content.ts         # Carga y helpers del contenido (incluye búsqueda)
│   └── types/
│       └── standard.ts        # Tipos del modelo de datos (Standard/Section/...)
├── tailwind.config.ts         # Paleta pastel y tema
└── package.json
```

## Reemplazar el contenido sintético por los PDFs reales

Todo el contenido de las normas vive como JSON en `src/content/`, con un archivo
por familia:

- `src/content/ifrs.json` — NIIF / IFRS
- `src/content/ias.json` — NIC / IAS
- `src/content/ifric.json` — CINIIF / IFRIC
- `src/content/sic.json` — SIC

Cada archivo es un **array de objetos `Standard`**. Para reemplazar el texto de
ejemplo por el texto oficial de un PDF, edita el objeto correspondiente y
sustituye los campos `objetivo`, `alcance` y los `parrafos` de cada `seccion`
por el texto real. **No necesitas tocar el código**: la interfaz y la búsqueda
se actualizan automáticamente a partir del JSON.

### Forma de los datos

Los tipos están definidos en `src/types/standard.ts`:

```ts
type Family = "IFRS" | "IAS" | "IFRIC" | "SIC";

interface Paragraph {
  id: string;     // id estable y único dentro de la norma, p. ej. "s1-p2"
  numero: string; // etiqueta mostrada del párrafo, p. ej. "1.2"
  texto: string;  // texto del párrafo (reemplazar por el oficial)
}

interface Section {
  id: string;           // id estable, p. ej. "s1"
  titulo: string;       // título de la sección
  parrafos: Paragraph[]; // al menos uno
}

interface Standard {
  slug: string;        // URL-safe y estable, p. ej. "niif-15"
  familia: Family;     // una de las cuatro familias
  numero: number;      // número oficial de la norma
  codigo: string;      // p. ej. "NIIF 15" / "NIC 1" / "CINIIF 23" / "SIC 32"
  titulo: string;      // título oficial en español
  objetivo: string;    // objetivo de la norma
  alcance: string;     // alcance de la norma
  secciones: Section[]; // al menos una
  sintetico: true;     // marca que el cuerpo es de ejemplo; ponlo en false
                       // cuando sustituyas por texto oficial, si lo prefieres
}
```

Ejemplo mínimo de una norma:

```json
{
  "slug": "niif-15",
  "familia": "IFRS",
  "numero": 15,
  "codigo": "NIIF 15",
  "titulo": "Ingresos de actividades ordinarias procedentes de contratos con clientes",
  "objetivo": "Texto oficial del objetivo…",
  "alcance": "Texto oficial del alcance…",
  "secciones": [
    {
      "id": "s1",
      "titulo": "Reconocimiento",
      "parrafos": [
        { "id": "s1-p1", "numero": "1", "texto": "Texto oficial del párrafo…" }
      ]
    }
  ],
  "sintetico": true
}
```

### Validar la integridad del contenido

Después de editar los JSON, ejecuta:

```bash
npm run validate
```

Este comando (`node scripts/validate-content.mjs`) verifica que cada archivo es
un array no vacío, que todos los `slug` son únicos, que los campos obligatorios
(`codigo`, `titulo`, `objetivo`, `alcance`) no están vacíos, que cada norma
tiene al menos una sección con al menos un párrafo, y que la `familia` es válida.
Imprime los conteos por familia y termina con código distinto de cero si algo
falla. No requiere dependencias ni acceso a Internet.

> El script `scripts/generate-content.mjs` solo se usó para **generar** el
> contenido de ejemplo inicial. Una vez empieces a editar los JSON a mano, el
> JSON es la fuente de verdad; no vuelvas a ejecutar el generador o sobrescribirá
> tus cambios.

## Despliegue en Vercel

Este proyecto es una app estándar de Next.js y se despliega en
[Vercel](https://vercel.com/) sin configuración adicional. No requiere variables
de entorno. Usa la cuenta **sarabermuisa@gmail.com**.

1. **Crea un repositorio en GitHub** y sube el proyecto:

   ```bash
   git init            # si aún no es un repositorio
   git add .
   git commit -m "Lector de NIIF"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```

2. **Inicia sesión en Vercel** con la cuenta `sarabermuisa@gmail.com` en
   [vercel.com](https://vercel.com/). Si es la primera vez, conecta tu cuenta de
   GitHub cuando Vercel lo solicite.

3. En el panel de Vercel, pulsa **New Project → Import** y selecciona el
   repositorio de GitHub que acabas de subir.

4. Vercel detecta automáticamente el framework como **Next.js**. No es necesario
   cambiar los comandos de build ni definir variables de entorno.

5. Pulsa **Deploy**. Al terminar, Vercel te dará una URL pública (del tipo
   `https://<tu-proyecto>.vercel.app`) con el lector ya en línea.

Cada vez que hagas `git push` a la rama principal, Vercel volverá a desplegar
automáticamente la última versión.

## Nota sobre el contenido

Todo el texto de las normas incluido en este repositorio es **sintético y de
ejemplo**, pensado para demostrar la interfaz y ser reemplazado por el contenido
oficial. Los nombres, números y títulos de las normas son de dominio público; el
cuerpo (objetivo, alcance y párrafos) es un marcador generado automáticamente.
