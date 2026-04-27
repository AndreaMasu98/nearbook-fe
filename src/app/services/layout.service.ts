import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/* Questo servizio gestisce la logica di layout dell'applicazione, come mostrare o nascondere la navbar e il footer in base alla rotta corrente e allo stato di autenticazione dell'utente. */
@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Rotte che non mostrano navbar/footer
  private publicRoutes = ['/login', '/register', '/privacy', '/cookies'];

  constructor(private router: Router, private authService: AuthService) {}

  /* Restituisce un Observable che emette true se la rotta corrente è una rotta pubblica (che non mostra navbar/footer), altrimenti false. */
  isPublicRoute(): Observable<boolean> {
    return new Observable(observer => {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const isPublic = this.publicRoutes.includes(event.urlAfterRedirects);
          observer.next(isPublic);
        }
      });
    });
  }

  /* Restituisce un Observable che emette true se la navbar e il footer dovrebbero essere mostrati (cioè se la rotta corrente non è pubblica e l'utente è autenticato), altrimenti false. */
  shouldShowLayout(): Observable<boolean> {
    return this.isPublicRoute().pipe(
      map(isPublic => !isPublic && this.authService.isAuthenticated())
    );
  }
}
