import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth.service';
import type { Usuario, Rol } from '../types/auth';

export const useAuthStore = defineStore('auth', () => {
  // el access token vive SOLO en memoria (no en localStorage): si alguien mete un script, no lo encuentra guardado
  const accessToken = ref('');
  const usuario = ref<Usuario | null>(null);

  const logueado = computed(() => accessToken.value !== '');

  function guardarSesion(token: string, datos: Usuario) {
    accessToken.value = token;
    usuario.value = datos;
  }

  function limpiar() {
    accessToken.value = '';
    usuario.value = null;
  }

  async function login(email: string, password: string) {
    const sesion = await authService.login(email, password);
    guardarSesion(sesion.accessToken, sesion.usuario);
  }

  // si varias pantallas piden refrescar al mismo tiempo, hago UNA sola petición y todas esperan esa
  let refrescando: Promise<boolean> | null = null;

  function refrescar(): Promise<boolean> {
    if (!refrescando) {
      refrescando = authService
        .refrescar()
        .then((sesion) => {
          guardarSesion(sesion.accessToken, sesion.usuario);
          return true;
        })
        .catch(() => {
          limpiar();
          return false;
        })
        .finally(() => {
          refrescando = null;
        });
    }
    return refrescando;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      limpiar(); // aunque falle el backend, cierro la sesión en la app
    }
  }

  function tieneRol(...roles: Rol[]) {
    return usuario.value !== null && roles.includes(usuario.value.rol);
  }

  return { accessToken, usuario, logueado, login, refrescar, logout, tieneRol };
});
