import { Injectable, inject } from '@angular/core';
import { Database, ref, objectVal } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  // Inyección moderna de dependencias (Angular 14+)
  private db = inject(Database);

  // Obtener lecturas en tiempo real usando objectVal (AngularFire v18+)
  // objectVal desenvuelve automáticamente el snapshot de Firebase
  getLecturas(): Observable<any> {
    const dbRef = ref(this.db, 'monitoreo');
    return objectVal(dbRef);
  }

  // Validación de rango (2°C a 8°C)
  validarRango(temp: number): boolean {
    // Si temp es null o undefined, retornamos false por seguridad
    if (temp === null || temp === undefined) return false;
    return temp >= 2 && temp <= 8;
  }
}