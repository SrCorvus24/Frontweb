export type Rol = 'ADMINISTRADOR' | 'ALMACENISTA' | 'CONSULTA';

export interface Usuario {
  id: number;
  name: string;
  email: string;
  rol: Rol;
}

// lo que devuelve el backend al hacer login o refresh
export interface Sesion {
  accessToken: string;
  usuario: Usuario;
}
