import api from './api';
import type { Salida } from '../types/inventario';

export const salidaService = {
  async registrar(varianteId: number, cantidad: number): Promise<Salida> {
    const { data } = await api.post('/salidas', {
      variante_id: varianteId,
      cantidad: cantidad,
    });
    return data.data;
  },
};