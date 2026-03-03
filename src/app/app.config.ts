import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAwiIM-HGDnpPe0NhmBC2-A0HIQHFfeKsM",
      authDomain: "monitor-laboratorio.firebaseapp.com",
      databaseURL: "https://monitor-laboratorio-default-rtdb.firebaseio.com",
      projectId: "monitor-laboratorio",
      storageBucket: "monitor-laboratorio.firebasestorage.app",
      messagingSenderId: "815465221981",
      appId: "1:815465221981:web:5bc31851bce6856fbbe2b4",
      measurementId: "G-94Y7FRYE1X"
    })),
    provideDatabase(() => getDatabase())
  ]
};