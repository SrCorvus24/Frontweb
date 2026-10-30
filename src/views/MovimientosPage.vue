<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/productos"></ion-back-button>
        </ion-buttons>
        <ion-title>Movimientos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p v-if="error" class="ion-padding">{{ error }}</p>
      <p v-if="movimientos.length === 0 && !error" class="ion-padding">Esta talla no tiene movimientos.</p>

      <ion-list>
        <ion-item v-for="m in movimientos" :key="m.id">
          <ion-badge slot="start" :color="m.tipo === 'ENTRADA' ? 'success' : 'danger'">
            {{ m.tipo }}
          </ion-badge>
          <ion-label>
            <h2>{{ m.cantidad }} und · Lote #{{ m.lote_id }}</h2>
            <p>{{ fecha(m.fecha) }} · ${{ Number(m.costo_unitario).toLocaleString('es-CO') }} c/u</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonBadge, onIonViewWillEnter } from '@ionic/vue';
import { movimientoService } from '../services/movimiento.service';
import type { Movimiento } from '../types/inventario';

const route = useRoute();
const varianteId = Number(route.params.varianteId);

const movimientos = ref<Movimiento[]>([]);
const error = ref('');

// paso la fecha a formato colombiano (ej: 22/10/2026)
function fecha(valor: string) {
  return new Date(valor).toLocaleDateString('es-CO');
}

// cada vez que entro, traigo el historial de la talla
onIonViewWillEnter(async () => {
  try {
    movimientos.value = await movimientoService.listarPorVariante(varianteId);
  } catch {
    error.value = 'No se pudo cargar el historial';
  }
});
</script>