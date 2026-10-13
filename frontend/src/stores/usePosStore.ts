import { create } from 'zustand';

export interface PosProduct {
  id: number;
  barcode: string | null;
  sku: string | null;
  name: string;
  sale_price: number;
  purchase_price: number;
  stock: number;
  presentation?: { name: string } | null;
}

export interface CartItem {
  product: PosProduct;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface PosStoreState {
  items: CartItem[];
  paymentType: 'cash' | 'credit';
  paymentMethod: 'cash' | 'transfer' | 'card';
  amountPaid: number;
  customerId: number | null;
  dueDate: string;
  notes: string;

  // Actions
  addItem: (product: PosProduct) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setPaymentType: (type: 'cash' | 'credit') => void;
  setPaymentMethod: (method: 'cash' | 'transfer' | 'card') => void;
  setAmountPaid: (amount: number) => void;
  setCustomerId: (id: number | null) => void;
  setDueDate: (date: string) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;

  // Helpers
  getTotal: () => number;
  getChange: () => number;
  getBalanceDue: () => number;
}

export const usePosStore = create<PosStoreState>((set, get) => ({
  items: [],
  paymentType: 'cash',
  paymentMethod: 'cash',
  amountPaid: 0,
  customerId: 1, // Consumidor Final por defecto
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  notes: '',

  addItem: (product) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.product.id === product.id);

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + 1;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        subtotal: newQty * updated[existingIndex].unit_price,
      };
      set({ items: updated });
    } else {
      const price = Number(product.sale_price);
      set({
        items: [
          ...items,
          {
            product,
            quantity: 1,
            unit_price: price,
            subtotal: price,
          },
        ],
      });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const updated = get().items.map((item) => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.unit_price,
        };
      }
      return item;
    });
    set({ items: updated });
  },

  setPaymentType: (paymentType) => set({ paymentType }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAmountPaid: (amountPaid) => set({ amountPaid }),
  setCustomerId: (customerId) => set({ customerId }),
  setDueDate: (dueDate) => set({ dueDate }),
  setNotes: (notes) => set({ notes }),

  clearCart: () =>
    set({
      items: [],
      paymentType: 'cash',
      paymentMethod: 'cash',
      amountPaid: 0,
      notes: '',
    }),

  getTotal: () => {
    return get().items.reduce((acc, curr) => acc + curr.subtotal, 0);
  },

  getChange: () => {
    const { paymentType, amountPaid } = get();
    const total = get().getTotal();
    if (paymentType === 'credit') return 0;
    return Math.max(0, amountPaid - total);
  },

  getBalanceDue: () => {
    const { paymentType, amountPaid } = get();
    const total = get().getTotal();
    if (paymentType === 'cash') return 0;
    return Math.max(0, total - amountPaid);
  },
}));
