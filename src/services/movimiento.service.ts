import api from './api';
import type { Movimiento } from '../types/inventario';

export const movimientoService = {
  async listarPorVariante(varianteId: number): Promise<Movimiento[]> {
    const { data } = await api.get(`/movimientos/variante/${varianteId}`);
    return data.data;
  },
};