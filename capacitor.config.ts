import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f8f0e91ccd5b44cc85bfe3b4d1a3581a',
  appName: 'sport-insight-wiz',
  webDir: 'dist',
  server: {
    url: 'https://f8f0e91c-cd5b-44cc-85bf-e3b4d1a3581a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      saveToGallery: true,
    },
  },
};

export default config;
