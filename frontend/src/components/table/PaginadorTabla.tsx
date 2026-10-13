import React, { useId } from 'react';
import { Button } from '../ui/button';

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100] as const;

function getPages(page: number, totalPages: number, compacto: boolean): (number | '...')[] {
  if (compacto) {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 2) return [1, 2, 3, '...', totalPages];
    if (page >= totalPages - 1) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page, '...', totalPages];
  }
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, '...', page - 1, page, page + 1, '...', totalPages];
}

const MILES = new Intl.NumberFormat('es-CO');

export function PaginadorTabla({
  tamano,
  onTamano,
  pagina,
  totalPaginas,
  onPagina,
  compacto = false,
  desde,
  hasta,
  total,
}: {
  tamano: number;
  onTamano: (n: number) => void;
  pagina: number;
  totalPaginas: number;
  onPagina: (n: number) => void;
  compacto?: boolean;
  desde: number;
  hasta: number;
  total: number;
}) {
  const id = useId();

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 bg-stone-50/70 border-t border-stone-200 text-xs text-stone-600">
      <div className="flex items-center gap-3">
        <label htmlFor={id} className="font-medium text-stone-500">
          Filas por página:
        </label>
        <select
          id={id}
          value={tamano}
          onChange={(e) => onTamano(Number(e.target.value))}
          className="h-8 px-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {total > 0 && (
          <span className="tabular-nums text-stone-500">
            Mostrando <strong>{MILES.format(desde)}–{MILES.format(hasta)}</strong> de <strong>{MILES.format(total)}</strong> registros
          </span>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pagina === 1}
            onClick={() => onPagina(pagina - 1)}
            aria-label="Página anterior"
          >
            ‹
          </Button>

          {getPages(pagina, totalPaginas, compacto).map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="px-1 text-stone-400">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === pagina ? 'default' : 'outline'}
                size="sm"
                className={`h-8 w-8 p-0 text-xs font-bold ${
                  p === pagina ? 'bg-stone-900 text-white' : 'text-stone-700'
                }`}
                onClick={() => onPagina(p as number)}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={pagina === totalPaginas}
            onClick={() => onPagina(pagina + 1)}
            aria-label="Página siguiente"
          >
            ›
          </Button>
        </div>
      )}
    </div>
  );
}
