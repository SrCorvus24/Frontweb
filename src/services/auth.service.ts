import api from './api';
import type { Sesion } from '../types/auth';

export const authService = {
  async login(email: string, password: string): Promise<Sesion> {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  // no mando nada: el navegador manda solo la cookie con el refresh token
  async refrescar(): Promise<Sesion> {
    const { data } = await api.post('/auth/refresh');
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
