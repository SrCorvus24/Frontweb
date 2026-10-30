<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <div class="marca">
            <!-- logo de DrStock: cuadro blanco, cruz negra y centro rojo -->
            <svg width="28" height="28" viewBox="0 0 48 48">
              <rect width="48" height="48" rx="11" fill="#FFFFFF" />
              <rect x="19" y="7" width="10" height="10" rx="2" fill="#111111" />
              <rect x="7" y="19" width="10" height="10" rx="2" fill="#111111" />
              <rect x="31" y="19" width="10" height="10" rx="2" fill="#111111" />
              <rect x="19" y="31" width="10" height="10" rx="2" fill="#111111" />
              <rect x="19" y="19" width="10" height="10" rx="2" fill="#C8102E" />
            </svg>
            <span><span class="dr">Dr</span><strong>Stock</strong></span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/alertas" color="danger">Alertas</ion-button>
          <ion-button @click="salir">Salir</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p v-if="auth.usuario" class="saludo">
        Hola, {{ auth.usuario.name }} · <strong>{{ auth.usuario.rol }}</strong>
      </p>
      <p v-if="error">{{ error }}</p>

      <!-- tarjetas de resumen, como en el Panel del mockup -->
      <div class="resumen">
        <div class="tarjeta">
          <span class="etiqueta">Prendas</span>
          <span class="numero">{{ productos.length }}</span>
        </div>
        <div class="tarjeta alerta" @click="router.push('/alertas')">
          <span class="etiqueta">Tallas por pedir</span>
          <span class="numero">{{ porPedir }}</span>
        </div>
      </div>

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonButton, onIonViewWillEnter } from '@ionic/vue';
import { productoService } from '../services/producto.service';
import { varianteService } from '../services/variante.service';
import type { Producto } from '../types/inventario';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const productos = ref<Producto[]>([]);
const porPedir = ref(0);
const error = ref('');

async function salir() {
  await auth.logout();
  router.replace('/login');
}

// cada vez que entro, traigo las prendas y cuento cuántas tallas hay que pedir
onIonViewWillEnter(async () => {
  try {
    productos.value = await productoService.listar();
    const alertas = await varianteService.alertas();
    porPedir.value = alertas.length;
  } catch {
    error.value = 'No se pudo conectar con el backend';
  }
});
</script>

<style scoped>
.marca {
  display: flex;
  align-items: center;
  gap: 10px;
}

.resumen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px;
}

.tarjeta {
  background: #FFFFFF;
  border: 1px solid #E2E2E2;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.etiqueta {
  font-size: 13px;
  color: #5C5C5C;
}

.numero {
  font-size: 26px;
  font-weight: 600;
  font-family: 'IBM Plex Mono', monospace;
}

/* la tarjeta de alertas va con borde y número en rojo */
.alerta {
  border-color: #C8102E;
  cursor: pointer;
}

.alerta .numero {
  color: #C8102E;
}

.saludo {
  margin: 16px 16px 0;
  font-size: 14px;
  color: #5C5C5C;
}

.dr {
  font-weight: 400;
  color: #A3A3A3;
}
</style>