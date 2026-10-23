import api from './api';
import type { Lote } from '../types/inventario';

export const loteService = {
  async registrar(varianteId: number, cantidad: number, costo: number): Promise<Lote> {
    const { data } = await api.post('/lotes', {
      variante_id: varianteId,
      cantidad: cantidad,
      costo_unitario: costo,
    });
    return data.data;
  },
};
