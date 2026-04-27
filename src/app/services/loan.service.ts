import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.interface';
import { environment } from '../../environments/environment';

/* Questo servizio gestisce tutte le operazioni relative ai prestiti, come richiedere un prestito, ottenere i prestiti ricevuti e aggiornare lo stato di un prestito. */  
@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /* Richiede un prestito per un libro specifico, con un messaggio opzionale. Restituisce un Observable che emette un oggetto contenente la richiesta di prestito creata. */
  requestLoan(libro_id: number, messaggio?: string): Observable<{ richiesta: Loan }> {
    return this.http.post<{ richiesta: Loan }>(`${this.apiUrl}/loans`, {
      libro_id,
      messaggio
    });
  }

  /* Ottiene i prestiti ricevuti dall'utente. Restituisce un Observable che emette un array di richieste di prestito. */
  getReceivedLoans(): Observable<{ richieste: Loan[] }> {
    return this.http.get<{ richieste: Loan[] }>(`${this.apiUrl}/loans/received`);
  }

  /* Aggiorna lo stato di una richiesta di prestito (accettata o rifiutata). Restituisce un Observable che emette un oggetto contenente la richiesta di prestito aggiornata. */
  updateLoanStatus(id: number, stato: 'accettata' | 'rifiutata'): Observable<{ richiesta: Loan }> {
    return this.http.patch<{ richiesta: Loan }>(`${this.apiUrl}/loans/${id}`, { stato });
  }
}
