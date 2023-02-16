import { createSlice} from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: [],
        isLoading: true,
        page: "", //window.location.pathname
        haveError: null
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
        },
        loading: (state) => {
            state.isLoading = true,
            state.haveError = null
        },
        notLoading: (state, {payload}) => {
            state.isLoading = false,
            state.haveError = payload
        },
        dataFound: ( state, { payload } ) => {
            state.data = payload,
            state.isLoading = false,
            state.page = window.location.pathname
        }
    },
});

export const { loadData, notLoading, loading, notLoadData, dataFound } = dashboardSlice.actions;