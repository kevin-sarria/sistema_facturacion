import { create } from "zustand";

export const useReceiptStore = create()((set) => ({
    isLoading: false,
    receiptData: {
        providerInfo: {
            name_provider: '',
            nit: '',
            direccion: '',
            numero_contacto: ''
        },
        date: null,
        products: [],
        iva: 0
    },
    errors: [],

    loading: () => set({
        isLoading: true,
    }),
    
}));