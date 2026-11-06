# DrStock - App movil (Ionic Vue)

App de inventario Just-in-Time para una tienda de ropa urbana de hombre, manejada por talla.
Proyecto #12 del curso: motor de reorden y trazabilidad de lotes bajo PEPS.

## Que hace

- Login con roles: Administrador, Almacenista y Consulta
- Lista de prendas y sus tallas con alerta de reorden (en rojo las que hay que pedir)
- Registrar ventas (descuenta por PEPS) y compras (crea lotes nuevos)
- Kardex de movimientos por talla
- Pantalla "Por pedir" con todas las tallas que necesitan reorden

## Tecnologias

Ionic 8 + Vue 3 + TypeScript, Pinia (sesion), Vue Router (guardias por rol), Axios (interceptores) y Capacitor (APK).

## Correr en el PC

```
npm install --legacy-peer-deps
npx vite --port 8100
```

Necesita el backend (repo Backweb) corriendo en `http://localhost:3000`.

## Usuarios de prueba

| Correo | Clave | Rol |
|---|---|---|
| admin@drstock.com | Admin123 | ADMINISTRADOR |
| almacen@drstock.com | Almacen123 | ALMACENISTA |
| consulta@drstock.com | Consulta123 | CONSULTA |

## APK

El APK se genera solo con GitHub Actions cada vez que se sube algo a `main`
(archivo `.github/workflows/apk.yml`). Se descarga en la pestana Actions -> Artifacts.

## Ramas

`feature/ionic` -> `develop` -> `qa` -> `main`, con Pull Requests.

Autor: Xander Rodriguez Osorio
