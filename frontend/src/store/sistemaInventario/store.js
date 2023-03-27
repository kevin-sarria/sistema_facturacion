import { configureStore } from '@reduxjs/toolkit';
import { authSlice, dashboardSlice } from "../";



export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        dashboard: dashboardSlice.reducer,
    }
})