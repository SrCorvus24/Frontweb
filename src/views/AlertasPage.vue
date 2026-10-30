<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/productos"></ion-back-button>
        </ion-buttons>
        <ion-title>Por pedir</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p v-if="cargando" class="ion-padding">Revisando tallas...</p>
      <p v-if="error" class="ion-padding">{{ error }}</p>
      <p v-if="!cargando && alertas.length === 0 && !error" class="ion-padding">Todo al día, no hay que pedir nada.</p>

      <ion-list>
        <ion-item v-for="a in alertas" :key="a.variante_id" :router-link="'/entrada/' + a.variante_id" button>
          <ion-label>
            <h2>{{ a.prenda }} · Talla {{ a.talla }}</h2>
            <p>Stock: {{ a.stock_actual }} und · Pedir cuando baje de {{ a.punto_reorden }} und</p>
          </ion-label>
          <ion-badge slot="end" color="danger">Reordenar</ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonBadge, onIonViewWillEnter } from '@ionic/vue';
import { varianteService } from '../services/variante.service';
import type { Reorden } from '../types/inventario';

const alertas = ref<Reorden[]>([]);
const cargando = ref(true);
const error = ref('');

// cada vez que entro, reviso qué tallas hay que pedir
onIonViewWillEnter(async () => {
  cargando.value = true;
  try {
    alertas.value = await varianteService.alertas();
  } catch {
    error.value = 'No se pudieron cargar las alertas';
  }
  cargando.value = false;
});
</script>