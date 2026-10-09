<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useProductosStore } from '@/stores/productos'

const store = useProductosStore()
const form = reactive({ nombre: '', unidad: '', stock_minimo: 0 })

onMounted(() => store.cargar())

async function guardar() {
  if (!form.nombre || !form.unidad) return
  await store.crear({ ...form })
  form.nombre = ''
  form.unidad = ''
  form.stock_minimo = 0
}
</script>

<template>
  <main class="contenedor">
    <h1>Productos</h1>

    <form class="formulario" @submit.prevent="guardar">
      <input v-model="form.nombre" placeholder="Nombre" />
      <input v-model="form.unidad" placeholder="Unidad (litro, unidad...)" />
      <input v-model.number="form.stock_minimo" type="number" min="0" placeholder="Stock mínimo" />
      <button type="submit">Crear producto</button>
    </form>

    <p v-if="store.cargando">Cargando...</p>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <table v-else>
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Unidad</th><th>Stock mínimo</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in store.productos" :key="p.id">
          <td>{{ p.id }}</td><td>{{ p.nombre }}</td><td>{{ p.unidad }}</td><td>{{ p.stock_minimo }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.contenedor { max-width: 800px; margin: 2rem auto; font-family: sans-serif; }
.formulario { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
.formulario input { padding: 0.5rem; flex: 1; }
button { padding: 0.5rem 1rem; cursor: pointer; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
.error { color: red; }
</style>