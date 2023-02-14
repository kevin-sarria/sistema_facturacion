import { createSlice} from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: [],
        page: "" //window.location.pathname
    },
    reducers: {
        loadData: (state) => {
            state.data = [],
            state.page = window.location.pathname
        }
    },
});

export const { loadData } = dashboardSlice.actions;