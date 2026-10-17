<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/productos"></ion-back-button>
        </ion-buttons>
        <ion-title>Tallas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p v-if="cargando">Cargando...</p>
      <p v-if="error">{{ error }}</p>

      <ion-list>
        <ion-item v-for="t in tallas" :key="t.id">
          <ion-label>
            <h2>Talla {{ t.talla }} · {{ t.sku }}</h2>
            <p>Stock: {{ t.stock }} und · Punto de reorden: {{ t.reorden.punto_reorden }} und</p>
          </ion-label>
          <ion-badge slot="end" :color="t.reorden.necesita_reorden ? 'danger' : 'medium'">
            {{ t.reorden.necesita_reorden ? 'Reordenar' : 'Al día' }}
          </ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButtons, IonBackButton } from '@ionic/vue';
import { varianteService } from '../services/variante.service';
import type { Variante, Reorden } from '../types/inventario';

// Una talla junto con su cálculo de reorden
interface TallaConReorden extends Variante {
  reorden: Reorden;
}

const route = useRoute();
const tallas = ref<TallaConReorden[]>([]);
const cargando = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const productoId = Number(route.params.id);
    const variantes = await varianteService.listarPorProducto(productoId);

    // Por cada talla, pedirle al motor de reorden su cálculo
    for (const v of variantes) {
      const reorden = await varianteService.reorden(v.id);
      tallas.value.push({ ...v, reorden });
    }
  } catch {
    error.value = 'No se pudo cargar la información';
  } finally {
    cargando.value = false;
  }
});
</script>