<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

// si la sesión se cae (por ejemplo, venció el refresh token), mando al login
watch(
  () => auth.logueado,
  (logueado) => {
    if (!logueado && !route.meta.publica) {
      router.replace('/login');
    }
  }
);
</script>
