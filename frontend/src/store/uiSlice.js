import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  toast: null,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, { payload }) => {
      state.sidebarOpen = payload;
    },
    openModal: (state, { payload }) => {
      state.activeModal = payload.modal;
      state.modalData = payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    showToast: (state, { payload }) => {
      state.toast = typeof payload === 'string'
        ? { message: payload, type: 'info', id: Date.now() }
        : { ...payload, id: Date.now() };
    },
    clearToast: (state) => {
      state.toast = null;
    },
    setTheme: (state, { payload }) => {
      state.theme = payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showToast,
  clearToast,
  setTheme,
} = uiSlice.actions;

export const selectSidebarOpen = (s) => s.ui.sidebarOpen;
export const selectActiveModal = (s) => s.ui.activeModal;
export const selectModalData   = (s) => s.ui.modalData;
export const selectToast        = (s) => s.ui.toast;

export default uiSlice.reducer;
