import { create } from "zustand";

interface AuthState {
    isLoading: boolean;
    userData: {
        email: string,
        name: string,
        type_user: string | null,
        image_url: string
    };
    errors: Array<any>;
    loading: () => void;
    startSession: ( data: any ) => void;
    closeSession: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    isLoading: false,
    userData: {
        email: '',
        name: '',
        type_user: null,
        image_url: '',
    },
    errors: [],

    loading: () => set({
        isLoading: true,
    }),
    startSession: (data) => set({ 
        isLoading: false,
        userData: {...data},
        errors: [],
    }),
    closeSession: () => set({
        isLoading: false,
        userData: {
            email: '',
            name: '',
            type_user: null,
            image_url: '',
        },
        errors: []
    })
}));