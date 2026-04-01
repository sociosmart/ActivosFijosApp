import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.smartgasoperativa',
  appName: 'SocioSmart Operacion',
  
  webDir: 'www',
  server: {
    allowNavigation: ['*'], // Allow navigation to all URLs
    cleartext: true // Allow HTTP requests
  },
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    }
  }
};

export default config;
