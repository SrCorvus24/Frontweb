<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/productos"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p v-if="cargando">Cargando...</p>
      <p v-if="error">{{ error }}</p>

      <ion-list>
        <ion-item v-for="t in tallas" :key="t.id" :router-link="'/venta/' + t.id" button>
          <ion-label>
            <h2>Talla {{ t.talla }} · {{ t.sku }}</h2>
            <p>Stock: {{ t.stock }} und · Punto de reorden: {{ t.reorden.punto_reorden }} und</p>
            <!-- barra de stock: roja si toca pedir, verde si esta bien -->
            <ion-progress-bar
              class="barra"
              :value="nivel(t)"
              :color="t.reorden.necesita_reorden ? 'danger' : 'success'"
            ></ion-progress-bar>
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonProgressBar, IonButtons, IonBackButton, onIonViewWillEnter } from '@ionic/vue';
import { varianteService } from '../services/variante.service';
import type { Variante, Reorden } from '../types/inventario';

// una talla junto con su cálculo de reorden
interface TallaConReorden extends Variante {
  reorden: Reorden;
}

const route = useRoute();
const tallas = ref<TallaConReorden[]>([]);
const cargando = ref(true);
const error = ref('');

// el nombre de la prenda viene en el cálculo de reorden de cualquier talla
const titulo = computed(() => (tallas.value.length > 0 ? tallas.value[0].reorden.prenda : 'Tallas'));

// que tan llena esta la barra: comparo el stock con el doble del punto de reorden (maximo 1 = llena)
function nivel(t: TallaConReorden) {
  const tope = t.reorden.punto_reorden * 2;
  if (tope === 0) return 1;
  return Math.min(t.stock / tope, 1);
}

// cada vez que entro a esta pantalla, vuelvo a cargar las tallas
onIonViewWillEnter(async () => {
  tallas.value = [];
  cargando.value = true;

  try {
    const productoId = Number(route.params.id);
    const variantes = await varianteService.listarPorProducto(productoId);

    // por cada talla, le pido al motor de reorden su cálculo
    for (const v of variantes) {
      const reorden = await varianteService.reorden(v.id);
      tallas.value.push({ ...v, reorden });
    }
  } catch {
    error.value = 'No se pudo cargar la información';
  }

  cargando.value = false;
});
</script>
<style scoped>
.barra {
  margin-top: 6px;
  height: 6px;
  border-radius: 3px;
}
</style>
