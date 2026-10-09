import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Producto } from '@/types/inventario'
import { productoService } from '@/services/producto.service'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref<Producto[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar() {
    cargando.value = true
    error.value = null
    try {
      productos.value = await productoService.listar()
    } catch {
      error.value = 'No se pudieron cargar los productos'
    } finally {
      cargando.value = false
    }
  }

  async function crear(nuevo: { nombre: string; unidad: string; stock_minimo: number }) {
    const producto = await productoService.crear(nuevo)
    productos.value.push(producto)
  }

  return { productos, cargando, error, cargar, crear }
})