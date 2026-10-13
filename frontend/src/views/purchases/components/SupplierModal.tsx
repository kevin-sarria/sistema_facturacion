import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Truck } from 'lucide-react';

interface SupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (supplierData: {
    name: string;
    tax_id: string;
    contact_name: string;
    phone: string;
    contact_phone: string;
    email: string;
    address: string;
    notes: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  open,
  onOpenChange,
  onSave,
  isSubmitting,
}) => {
  const [form, setForm] = useState({
    name: '',
    tax_id: '',
    contact_name: '',
    phone: '',
    contact_phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    setForm({
      name: '',
      tax_id: '',
      contact_name: '',
      phone: '',
      contact_phone: '',
      email: '',
      address: '',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                Registrar Proveedor / Distribuidor
              </DialogTitle>
              <p className="text-xs text-stone-500">
                Datos de la empresa y contacto del asesor comercial
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Nombre de la Empresa / Distribuidora <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Distribuidora Papelera Nacional"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                NIT o Cédula
              </label>
              <input
                type="text"
                placeholder="Ej. 900.123.456-7"
                value={form.tax_id}
                onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Nombre del Asesor
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Celular del Asesor
              </label>
              <input
                type="text"
                placeholder="Ej. 310 123 4567"
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Teléfono Fijo / Empresa
              </label>
              <input
                type="text"
                placeholder="Ej. (601) 345 6789"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full min-h-11 text-xs border border-stone-300 rounded-xl px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">
              Notas (días de visita, condiciones de crédito...)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Visita los martes, ofrece 30 días de crédito..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full text-xs border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="min-h-11 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 px-5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
