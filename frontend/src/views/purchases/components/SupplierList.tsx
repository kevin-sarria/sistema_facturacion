import React from 'react';
import { Supplier } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { UserCheck, Phone, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface SupplierListProps {
  suppliers: Supplier[];
  onNewSupplier: () => void;
}

export const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  onNewSupplier,
}) => {
  if (suppliers.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-3">
        <div className="size-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <UserCheck className="size-6" />
        </div>
        <p className="text-sm font-bold text-stone-800">
          No hay proveedores registrados aún
        </p>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Registra tus distribuidores y los datos de contacto de sus asesores comerciales para pedidos.
        </p>
        <Button
          onClick={onNewSupplier}
          className="mt-2 min-h-11 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
        >
          <Plus className="size-4 mr-1.5" />
          <span>Registrar Primer Proveedor</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 gap-4">
      {suppliers.map((s) => (
        <div
          key={s.id}
          className="bg-white p-4.5 @sm:p-5 rounded-2xl @sm:rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between min-w-0"
        >
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-bold text-stone-900 text-sm leading-tight">{s.name}</h3>
              {s.tax_id && (
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono shrink-0">
                  NIT: {s.tax_id}
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 my-3">
              {s.contact_name && (
                <p className="flex items-center gap-1.5 font-medium text-stone-800">
                  <UserCheck className="size-3.5 text-amber-700 shrink-0" />
                  <span>{s.contact_name}</span>
                </p>
              )}
              {s.contact_phone && (
                <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Phone className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Asesor: {s.contact_phone}</span>
                </p>
              )}
              {s.phone && (
                <p className="flex items-center gap-1.5 text-stone-500">
                  <Phone className="size-3.5 text-stone-400 shrink-0" />
                  <span>Fijo: {s.phone}</span>
                </p>
              )}
              {s.notes && (
                <p className="text-[11px] text-stone-500 italic mt-2 border-t border-stone-100 pt-1.5">
                  {s.notes}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
            <span className="text-stone-500">Saldo que debemos:</span>
            <span className="font-black text-rose-600 text-sm tabular-nums">
              {formatCurrency(s.total_debt || 0)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
