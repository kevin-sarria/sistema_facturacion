import { createSlice} from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: [],
        isLoading: true,
        page: "" //window.location.pathname
    },
    reducers: {
        loadData: (state, { payload }) => {
            state.data = payload,
            state.isLoading = false,
            state.page = window.location.pathname
        },
        notLoadData: ( state ) => {
            state.data = [],
            state.isLoading = true,
            state.page = window.location.pathname
        }
    },
});

export const { loadData, notLoadData } = dashboardSlice.actions;