export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  tiempo_entrega_dias: number;
  created_at: string;
}

export interface Variante {
  id: number;
  producto_id: number;
  talla: string;
  sku: string;
  stock_minimo: number;
  stock: number;
}

export interface Reorden {
  variante_id: number;
  stock_actual: number;
  ventas_por_dia: number;
  stock_seguridad: number;
  punto_reorden: number;
  necesita_reorden: boolean;
}