import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.drstock.app',
  appName: 'DrStock',
  webDir: 'dist',
  server: {
    // mi API en el VPS es http (no https), así que la app también corre en http
    androidScheme: 'http',
    cleartext: true,
  },
  plugins: {
    // los pedidos al backend los hace Android directamente (no el navegador interno),
    // así no hay problemas de CORS y la cookie del refresh token funciona
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
