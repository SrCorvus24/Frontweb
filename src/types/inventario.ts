export interface Producto {
  id: number
  nombre: string
  unidad: string
  stock_minimo: string
  created_at: string
}

export interface Lote {
  id: number
  producto_id: number
  cantidad_inicial: string
  cantidad_disponible: string
  costo_unitario: string
  fecha_entrada: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}