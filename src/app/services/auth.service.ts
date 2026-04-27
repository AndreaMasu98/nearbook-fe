import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.interface';

export interface AuthResponse {
  user: User;
  token: string;
}

/* Questo servizio gestisce l'autenticazione dell'utente, inclusa la registrazione, il login, il logout e la gestione del token di autenticazione. Utilizza un BehaviorSubject per mantenere lo stato dell'utente corrente e fornisce metodi per accedere a questo stato e al token. */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* Effettua la registrazione di un nuovo utente chiamando l'endpoint di registrazione dell'API. Se la registrazione ha successo, salva il token e le informazioni dell'utente e aggiorna lo stato dell'utente corrente. */
  register(nome: string, cognome: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      nome, cognome, email, password
    }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /* Effettua il login di un utente chiamando l'endpoint di login dell'API. Se il login ha successo, salva il token e le informazioni dell'utente e aggiorna lo stato dell'utente corrente. */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email, password
    }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /* Effettua il logout dell'utente, rimuovendo il token e le informazioni dell'utente dallo storage e aggiornando lo stato dell'utente corrente. */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  /* Gestisce la risposta di autenticazione salvando il token e le informazioni dell'utente nello storage e aggiornando lo stato dell'utente corrente. */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  /* Restituisce il token di autenticazione salvato nello storage, o null se non è presente. */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /* Restituisce true se l'utente è autenticato (cioè se è presente un token), altrimenti restituisce false. */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /* Restituisce le informazioni dell'utente salvate nello storage, o null se non sono presenti. */
  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /* Restituisce le informazioni dell'utente corrente, o null se non è autenticato. */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
