import React from 'react';
import { useToastStore, toast, ToastType } from '../../stores/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export { toast };

const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const STYLES: Record<ToastType, { container: string; icon: string }> = {
  success: {
    container: 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-emerald-900/10',
    icon: 'text-emerald-600',
  },
  error: {
    container: 'bg-rose-50 border-rose-300 text-rose-950 shadow-rose-900/10',
    icon: 'text-rose-600',
  },
  info: {
    container: 'bg-white border-stone-300 text-stone-900 shadow-stone-900/10',
    icon: 'text-amber-600',
  },
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 pointer-events-none flex flex-col gap-2 
        top-3 inset-x-3 
        sm:top-auto sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-sm sm:w-full"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        const style = STYLES[t.type] || STYLES.info;

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in fade-in-0 slide-in-from-top-2 sm:slide-in-from-bottom-2 ${style.container}`}
          >
            <Icon className={`size-5 shrink-0 mt-0.5 ${style.icon}`} />
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors shrink-0"
              aria-label="Cerrar notificación"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
