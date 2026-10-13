import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message: string, type: ToastType = 'info', customDuration?: number) => {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) return;

    const { toasts } = get();

    // Deduplicar mensajes idénticos que ya estén visibles
    if (toasts.some((t) => t.message === trimmedMessage && t.type === type)) {
      return;
    }

    const duration = customDuration ?? (type === 'error' ? 6000 : 4000);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Máximo 3 visibles: descartamos los más viejos si ya hay 3
    const updated = toasts.length >= 3 ? [...toasts.slice(toasts.length - 2)] : [...toasts];
    updated.push({ id, type, message: trimmedMessage, duration });

    set({ toasts: updated });

    // Autocierre con temporizador
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, 'success', duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, 'error', duration),
  info: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, 'info', duration),
};
