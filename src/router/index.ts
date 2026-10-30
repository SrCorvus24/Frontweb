import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { Rol } from '../types/auth';
import LoginPage from '../views/LoginPage.vue';
import HomePage from '../views/HomePage.vue';
import ProductosPage from '../views/ProductosPage.vue';
import DetallePage from '../views/DetallePage.vue';
import VentaPage from '../views/VentaPage.vue';
import EntradaPage from '../views/EntradaPage.vue';
import MovimientosPage from '../views/MovimientosPage.vue';
import AlertasPage from '../views/AlertasPage.vue';

// roles que pueden mover inventario (vender y comprar)
const PUEDEN_EDITAR: Rol[] = ['ADMINISTRADOR', 'ALMACENISTA'];

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/productos' },
  { path: '/login', name: 'Login', component: LoginPage, meta: { publica: true } },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/productos', name: 'Productos', component: ProductosPage },
  { path: '/productos/:id', name: 'Detalle', component: DetallePage },
  { path: '/venta/:varianteId', name: 'Venta', component: VentaPage },
  { path: '/entrada/:varianteId', name: 'Entrada', component: EntradaPage, meta: { roles: PUEDEN_EDITAR } },
  { path: '/movimientos/:varianteId', name: 'Movimientos', component: MovimientosPage },
  { path: '/alertas', name: 'Alertas', component: AlertasPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// guardia: antes de entrar a cada pantalla reviso la sesión y el rol
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (to.meta.publica) {
    // si ya inicié sesión, no tiene sentido volver al login
    return auth.logueado ? '/productos' : true;
  }

  // al recargar la página (F5) el token en memoria se borra: intento recuperarlo con la cookie
  if (!auth.logueado) {
    const recuperada = await auth.refrescar();
    if (!recuperada) {
      return '/login';
    }
  }

  const roles = to.meta.roles as Rol[] | undefined;
  if (roles && !auth.tieneRol(...roles)) {
    return '/productos'; // no tiene permiso para esa pantalla
  }

  return true;
});

export default router;
