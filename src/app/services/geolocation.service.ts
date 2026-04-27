import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { Location } from '../models/location.interface';

/* Questo servizio gestisce tutte le operazioni relative alla geolocalizzazione, come ottenere la posizione corrente dell'utente e monitorare i cambiamenti di posizione. */
@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  /* Ottiene la posizione corrente dell'utente. Restituisce un Observable che emette un oggetto contenente latitudine e longitudine. In caso di errore, emette un errore con il messaggio dell'errore. */
  getCurrentLocation(): Observable<Location> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocalizzazione non supportata');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          observer.complete();
        },
        (error) => {
          observer.error(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  /* Monitora i cambiamenti di posizione dell'utente. Restituisce un Observable che emette un oggetto contenente latitudine e longitudine ogni volta che la posizione cambia. */
  watchPosition(): Observable<Location> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocalizzazione non supportata');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          observer.error(error.message);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    });
  }
}
