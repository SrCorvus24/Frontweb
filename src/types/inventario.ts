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
  prenda: string;
  talla: string;
  sku: string;
  stock_actual: number;
  ventas_por_dia: number;
  stock_seguridad: number;
  punto_reorden: number;
  necesita_reorden: boolean;
}

export interface SalidaDetalle {
  lote_id: number;
  cantidad: number;
  costo_unitario: number;
}

export interface Salida {
  variante_id: number;
  cantidad: number;
  costo_total: number;
  detalle: SalidaDetalle[];
}

export interface Lote {
  id: number;
  variante_id: number;
  cantidad_inicial: number;
  cantidad_disponible: number;
  costo_unitario: string;
  fecha_entrada: string;
}