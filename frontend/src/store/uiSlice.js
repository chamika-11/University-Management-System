import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ulms_theme');
    if (saved) return saved;
  }
  return 'dark';
};

const initialTheme = getInitialTheme();

// Sync initial HTML class
if (typeof document !== 'undefined') {
  if (initialTheme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
}

const initialState = {
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  toast: null,
  theme: initialTheme,
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('ulms_theme', payload);
        if (payload === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ulms_theme', nextTheme);
        if (nextTheme === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      }
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
  toggleTheme,
} = uiSlice.actions;

export const selectSidebarOpen = (s) => s.ui.sidebarOpen;
export const selectActiveModal = (s) => s.ui.activeModal;
export const selectModalData   = (s) => s.ui.modalData;
export const selectToast        = (s) => s.ui.toast;
export const selectTheme        = (s) => s.ui.theme || 'dark';

export default uiSlice.reducer;
