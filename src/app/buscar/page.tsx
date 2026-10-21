import type { Metadata } from "next";
import SearchBox from "@/components/SearchBox";
import { flattenForSearch } from "@/lib/content";

export const metadata: Metadata = {
  title: "Buscar · Lector de NIIF",
  description:
    "Busca texto en todas las Normas Internacionales de Información Financiera (NIIF/IFRS, NIC/IAS, CINIIF/IFRIC y SIC).",
};

export default function BuscarPage() {
  const records = flattenForSearch();

  return (
    <section>
      <h1>Buscar en las normas</h1>
      <p>
        Encuentra cualquier norma por su código, título o por el texto de sus
        párrafos. Hay <strong>{records.length}</strong> párrafos indexados.
      </p>
      <div className="mt-6">
        <SearchBox records={records} />
      </div>
    </section>
  );
}
