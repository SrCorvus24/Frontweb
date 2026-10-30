import api from './api';
import type { Producto } from '../types/inventario';

export const productoService = {
  async listar(): Promise<Producto[]> {
    const { data } = await api.get('/productos');
    return data.data;
  },
};