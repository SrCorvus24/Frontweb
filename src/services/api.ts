import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true, // para que el navegador mande la cookie del refresh token
});

// antes de cada pedido, le pego el access token
api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// marca para no reintentar un pedido más de una vez
type PedidoConReintento = InternalAxiosRequestConfig & { _reintentado?: boolean };

// si el backend responde 401 (el access token venció), pido uno nuevo y repito el pedido
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const pedido = error.config as PedidoConReintento | undefined;
    const esDeAuth = pedido?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && pedido && !esDeAuth && !pedido._reintentado) {
      pedido._reintentado = true;
      const auth = useAuthStore();
      const renovado = await auth.refrescar();
      if (renovado) {
        return api(pedido); // repito el pedido con el token nuevo
      }
    }

    return Promise.reject(error);
  }
);

export default api;
