import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { UserPlus } from 'lucide-react';

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCustomer: (customerData: {
    name: string;
    last_name: string;
    phone: string;
    document_number?: string;
    email?: string;
  }) => Promise<void>;
  isSaving: boolean;
  error: string;
}

export const NewCustomerDialog: React.FC<NewCustomerDialogProps> = ({
  open,
  onOpenChange,
  onSaveCustomer,
  isSaving,
  error,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setLocalError('Nombre, apellido y celular son obligatorios.');
      return;
    }

    await onSaveCustomer({
      name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      document_number: documentNumber.trim() || undefined,
      email: email.trim() || undefined,
    });

    // Limpiar formulario si se guardó
    if (!error) {
      setFirstName('');
      setLastName('');
      setPhone('');
      setDocumentNumber('');
      setEmail('');
      setLocalError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <UserPlus className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-stone-900">
                Registrar Cliente Rápido
              </DialogTitle>
              <p className="text-xs text-stone-500">
                Completa los datos de contacto para abrir la cuenta de fiado.
              </p>
            </div>
          </div>
        </DialogHeader>

        {(localError || error) && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Fila 1: Nombres y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Nombres <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Marta Sofía"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-900 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Apellidos <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Rodríguez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-900 font-medium"
              />
            </div>
          </div>

          {/* Fila 2: Celular y Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Celular / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ej. 310 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-900 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Cédula / Documento <span className="text-stone-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej. 52123456"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-900 font-medium"
              />
            </div>
          </div>

          {/* Fila 3: Correo */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Correo Electrónico <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <input
              type="email"
              placeholder="Ej. marta@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-11 text-xs border border-stone-200 rounded-xl px-3 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-900 font-medium"
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
              disabled={isSaving}
              className="min-h-11 px-5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-all disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar y Asignar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
