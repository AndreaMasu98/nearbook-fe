import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { ApiInterceptor } from './services/api.interceptor';

/* Questo file contiene la configurazione principale dell'applicazione, inclusa la definizione delle rotte e l'aggiunta dell'interceptor per le richieste HTTP. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ]
};
