<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Productos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p v-if="error">{{ error }}</p>

      <ion-list>
        <ion-item v-for="p in productos" :key="p.id" :router-link="'/productos/' + p.id" button>
          <ion-label>
            <h2>{{ p.nombre }}</h2>
            <p>{{ p.categoria }} · ${{ Number(p.precio).toLocaleString('es-CO') }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import { productoService } from '../services/producto.service';
import type { Producto } from '../types/inventario';

const productos = ref<Producto[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    productos.value = await productoService.listar();
  } catch {
    error.value = 'No se pudo conectar con el backend';
  }
});
</script>