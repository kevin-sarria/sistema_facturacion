import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking',   // 'checking', 'not-authenticated', 'authenticated'
    uid: null,
    email: null,
    displayName: null,
    errorMessage: null,
    isAdmin: false,
    authError: null
  },
  reducers: {
    login: (state, { payload }) => {

      state.status = 'authenticated';   // 'checking', 'not-authenticated', 'authenticated'
      state.uid = payload.id;
      state.email = payload.correo;
      state.displayName = payload.nombre;
      state.errorMessage = null;
      state.isAdmin = payload.admin;
      state.authError = null;
    },
    logout: (state, { payload }) => {

      state.status = 'not-authenticated';   // 'checking', 'not-authenticated', 'authenticated'
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.errorMessage = payload?.errorMessage;

    },
    checkingCredentials: (state) => {
      state.status = 'checking';
    },
    authError: (state, { payload }) => {
      state.status = 'not-authenticated';
      state.authError = payload;
    },
    clearAuthErrors: ( state ) => {
      state.authError = null;
    }


  }
});

export const { login, logout, checkingCredentials, authError, clearAuthErrors } = authSlice.actions;