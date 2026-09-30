import type { CapacitorConfig } from '@capacitor/cli';

// App Android (APK) empacotando o mesmo build web (dist/).
// Gerar: npm run apk  →  android/app/build/outputs/apk/debug/app-debug.apk
const config: CapacitorConfig = {
  appId: 'com.globodasnacoes.jogo',
  appName: 'Globo das Nações',
  webDir: 'dist',
  android: {
    backgroundColor: '#FFF8E7',
  },
};

export default config;
