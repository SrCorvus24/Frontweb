import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProductosPage from '../views/ProductosPage.vue';
import DetallePage from '../views/DetallePage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/productos' },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/productos', name: 'Productos', component: ProductosPage },
  { path: '/productos/:id', name: 'Detalle', component: DetallePage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;