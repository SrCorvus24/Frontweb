<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="caja">
        <!-- logo de DrStock -->
        <svg width="64" height="64" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="11" fill="#111111" />
          <rect x="19" y="7" width="10" height="10" rx="2" fill="#FFFFFF" />
          <rect x="7" y="19" width="10" height="10" rx="2" fill="#FFFFFF" />
          <rect x="31" y="19" width="10" height="10" rx="2" fill="#FFFFFF" />
          <rect x="19" y="31" width="10" height="10" rx="2" fill="#FFFFFF" />
          <rect x="19" y="19" width="10" height="10" rx="2" fill="#C8102E" />
        </svg>
        <h1><span class="dr">Dr</span><strong>Stock</strong></h1>
        <p class="subtitulo">Inventario de ropa urbana</p>

        <ion-item>
          <ion-input v-model="email" type="email" label="Correo" label-placement="stacked"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password" type="password" label="Contraseña" label-placement="stacked"></ion-input>
        </ion-item>

        <ion-button expand="block" @click="entrar">Iniciar sesión</ion-button>

        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { IonPage, IonContent, IonItem, IonInput, IonButton } from '@ionic/vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');

async function entrar() {
  error.value = '';

  if (!email.value || !password.value) {
    error.value = 'Escribe tu correo y tu contraseña';
    return;
  }

  try {
    await auth.login(email.value, password.value);
    router.replace('/productos');
  } catch (err) {
    // ej: "Correo o contraseña incorrectos" o "Demasiados intentos"
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.message;
    } else {
      error.value = 'No se pudo conectar con el servidor';
    }
  }
}
</script>

<style scoped>
.caja {
  max-width: 380px;
  margin: 60px auto 0;
  text-align: center;
}

h1 {
  margin: 12px 0 4px;
  font-size: 30px;
}

.dr {
  font-weight: 400;
  color: #5C5C5C;
}

.subtitulo {
  margin: 0 0 24px;
  color: #5C5C5C;
}

ion-item {
  text-align: left;
}

ion-button {
  margin-top: 20px;
}

.error {
  color: var(--ion-color-danger);
}
</style>
