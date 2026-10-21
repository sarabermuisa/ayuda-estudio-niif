"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Representa una norma individual en la barra lateral.
 * En FEAT-002/003 esta estructura se poblará desde el contenido real.
 */
export interface SidebarItem {
  slug: string;
  code: string;
  title: string;
}

/**
 * Grupo de normas por familia (NIIF/IFRS, NIC/IAS, CINIIF/IFRIC, SIC).
 */
export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  groups?: SidebarGroup[];
}

// Encabezados de familia por defecto. FEAT-002/003 pasarán `groups` con las normas.
const DEFAULT_GROUPS: SidebarGroup[] = [
  { id: "niif", label: "NIIF / IFRS", items: [] },
  { id: "nic", label: "NIC / IAS", items: [] },
  { id: "ciniif", label: "CINIIF / IFRIC", items: [] },
  { id: "sic", label: "SIC", items: [] },
];

export default function Sidebar({ groups }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const data = groups && groups.length > 0 ? groups : DEFAULT_GROUPS;

  return (
    <>
      {/* Botón de alternancia (solo móvil) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="niif-sidebar"
        className="mb-4 inline-flex items-center gap-2 rounded-lg bg-lavender px-3 py-2 text-sm font-medium text-ink shadow-sm md:hidden"
      >
        <span aria-hidden>☰</span>
        {open ? "Ocultar índice" : "Mostrar índice"}
      </button>

      <nav
        id="niif-sidebar"
        aria-label="Índice de normas"
        className={`${
          open ? "block" : "hidden"
        } w-full shrink-0 md:block md:w-72`}
      >
        <div className="space-y-6 rounded-xl bg-white/60 p-4 shadow-sm ring-1 ring-sky/60">
          {data.map((group) => (
            <section key={group.id}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">
                {group.label}
              </h2>
              {group.items.length === 0 ? (
                <p className="text-sm text-ink/40">Próximamente…</p>
              ) : (
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/norma/${item.slug}`}
                        className="block rounded-md px-2 py-1 text-sm text-ink/80 transition hover:bg-mint hover:text-ink"
                      >
                        <span className="font-medium">{item.code}</span>{" "}
                        <span className="text-ink/60">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </nav>
    </>
  );
}
