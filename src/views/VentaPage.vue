<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/productos"></ion-back-button>
        </ion-buttons>
        <ion-title>Registrar venta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="info">
        <h2>{{ info.prenda }} · Talla {{ info.talla }}</h2>
        <p>SKU {{ info.sku }} · Disponible: {{ info.stock_actual }} und</p>
      </div>

      <ion-item>
        <ion-input v-model="cantidad" type="number" label="Cantidad" label-placement="stacked"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="vender">Vender</ion-button>
      <ion-button expand="block" fill="outline" :router-link="'/entrada/' + varianteId">Registrar compra</ion-button>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="resultado">
        <h3>Salió así (PEPS)</h3>
        <ion-list>
          <ion-item v-for="d in resultado.detalle" :key="d.lote_id">
            <ion-label>Lote #{{ d.lote_id }}: {{ d.cantidad }} und × ${{ formato(d.costo_unitario) }}</ion-label>
          </ion-item>
        </ion-list>
        <p><strong>Costo total: ${{ formato(resultado.costo_total) }}</strong></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonInput, IonButton, IonList, IonLabel, onIonViewWillEnter } from '@ionic/vue';
import { varianteService } from '../services/variante.service';
import { salidaService } from '../services/salida.service';
import type { Reorden, Salida } from '../types/inventario';

const route = useRoute();
const varianteId = Number(route.params.varianteId);

const info = ref<Reorden | null>(null);
const cantidad = ref(1);
const resultado = ref<Salida | null>(null);
const error = ref('');

function formato(valor: number) {
  return valor.toLocaleString('es-CO');
}

// traigo nombre, talla y stock de la talla
async function cargarInfo() {
  info.value = await varianteService.reorden(varianteId);
}

async function vender() {
  error.value = '';
  resultado.value = null;

  const n = Number(cantidad.value);
  if (n <= 0) {
    error.value = 'La cantidad debe ser mayor a 0';
    return;
  }

  try {
    resultado.value = await salidaService.registrar(varianteId, n);
    cargarInfo(); // vuelvo a pedir el stock para que se actualice
  } catch (err) {
    // si el error viene del backend, muestro su mensaje (ej: "Solo hay 6 unidades")
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.message;
    } else {
      error.value = 'No se pudo registrar la venta';
    }
  }
}

// cada vez que entro a esta pantalla, actualizo el stock
onIonViewWillEnter(cargarInfo);
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
}
</style>