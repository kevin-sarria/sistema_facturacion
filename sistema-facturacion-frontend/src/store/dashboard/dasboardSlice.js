import { createSlice} from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: [],
        dataSearch: [],
        isLoading: true,
        page: "", //window.location.pathname
        haveError: null
    },
    reducers: {
        pageBlank: ( state ) => {
            state.data = [];
            state.isLoading = false;
            state.page = window.location.pathname;
            state.haveError = null;
        },
        loadData: (state, { payload }) => {
            state.data = payload,
            state.isLoading = false,
            state.page = window.location.pathname
        },
        notLoadData: ( state, {payload} ) => {
            state.data = [],
            state.isLoading = false,
            state.page = window.location.pathname,
            state.haveError = payload
        },
        loading: (state) => {
            state.isLoading = true,
            state.haveError = null
        },
        notLoading: (state, {payload}) => {
            state.dataSearch = [],
            state.isLoading = false,
            state.haveError = payload
        },
        dataFound: ( state, { payload } ) => {
            state.dataSearch = payload,
            state.isLoading = false,
            state.page = window.location.pathname
        },
        clearDataSearched: (state) => {
            state.dataSearch = []
            state.haveError = null;
        }
    },
});

export const { pageBlank, loadData, notLoading, loading, notLoadData, dataFound, clearDataSearched } = dashboardSlice.actions;