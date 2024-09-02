import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'netxz.cfd',
  appName: 'netxz-mobile',
  webDir: 'dist',
  server:{
    "url": "http://192.168.1.105:5173/",
    "cleartext": true
  }
};

export default config;
