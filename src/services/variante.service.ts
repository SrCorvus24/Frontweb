import api from './api';
import type { Variante, Reorden } from '../types/inventario';

export const varianteService = {
  async listarPorProducto(productoId: number): Promise<Variante[]> {
    const { data } = await api.get(`/variantes/producto/${productoId}`);
    return data.data;
  },

  async reorden(varianteId: number): Promise<Reorden> {
    const { data } = await api.get(`/reorden/variante/${varianteId}`);
    return data.data;
  },
};