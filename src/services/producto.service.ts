import api from './api'
import type { ApiResponse, Producto } from '@/types/inventario'

export const productoService = {
  async listar(): Promise<Producto[]> {
    const { data } = await api.get<ApiResponse<Producto[]>>('/productos')
    return data.data
  },

  async crear(producto: { nombre: string; unidad: string; stock_minimo: number }): Promise<Producto> {
    const { data } = await api.post<ApiResponse<Producto>>('/productos', producto)
    return data.data
  },
}