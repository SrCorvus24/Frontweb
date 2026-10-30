<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/productos"></ion-back-button>
        </ion-buttons>
        <ion-title>Registrar compra</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="info">
        <h2>{{ info.prenda }} · Talla {{ info.talla }}</h2>
        <p>SKU {{ info.sku }} · Stock actual: {{ info.stock_actual }} und</p>
      </div>

      <ion-item>
        <ion-input v-model="cantidad" type="number" label="Cantidad" label-placement="stacked"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input v-model="costo" type="number" label="Costo unitario ($)" label-placement="stacked"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="registrar">Registrar compra</ion-button>

      <p v-if="error" class="error">{{ error }}</p>

      <p v-if="lote">
        <strong>Lote #{{ lote.id }} creado:</strong>
        {{ lote.cantidad_inicial }} und a ${{ Number(lote.costo_unitario).toLocaleString('es-CO') }}
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonInput, IonButton } from '@ionic/vue';
import { varianteService } from '../services/variante.service';
import { loteService } from '../services/lote.service';
import type { Reorden, Lote } from '../types/inventario';

const route = useRoute();
const varianteId = Number(route.params.varianteId);

const info = ref<Reorden | null>(null);
const cantidad = ref(10);
const costo = ref(50000);
const lote = ref<Lote | null>(null);
const error = ref('');

// traigo nombre, talla y stock de la talla
async function cargarInfo() {
  info.value = await varianteService.reorden(varianteId);
}

async function registrar() {
  error.value = '';
  lote.value = null;

  const n = Number(cantidad.value);
  const c = Number(costo.value);
  if (n <= 0 || c <= 0) {
    error.value = 'La cantidad y el costo deben ser mayores a 0';
    return;
  }

  try {
    lote.value = await loteService.registrar(varianteId, n, c);
    cargarInfo(); // vuelvo a pedir el stock para que se actualice
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.message;
    } else {
      error.value = 'No se pudo registrar la compra';
    }
  }
}

onMounted(cargarInfo);
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
}
</style>