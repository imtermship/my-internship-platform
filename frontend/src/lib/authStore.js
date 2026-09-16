import { create } from 'zustand';
import { authAPI } from './api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user, loading: false });
      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  register: async (email, password, firstName, lastName, role) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(email, password, firstName, lastName, role);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user, loading: false });
      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await authAPI.verify();
      set({ user: response.data.user, token });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));
