import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.interface';
import { BookDetail } from '../models/book-detail.interface';

/* Questo servizio gestisce tutte le operazioni relative ai libri, come ottenere i libri vicini, i dettagli di un libro, creare un nuovo libro, eliminare un libro e ottenere statistiche. */
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /* Ottiene i libri vicini alla posizione dell'utente, con un raggio di ricerca e una categoria opzionali. Restituisce un Observable che emette un array di libri. */
  getNearbyBooks(lat: number, lng: number, raggio: number = 2000, categoria?: string): Observable<{ books: Book[] }> {
    let params = `?lat=${lat}&lng=${lng}&raggio=${raggio}`;
    if (categoria && categoria !== 'tutti') {
      params += `&categoria=${categoria}`;
    }
    return this.http.get<{ books: Book[] }>(`${this.apiUrl}/books${params}`);
  }

  /* Ottiene i dettagli di un libro specifico dato il suo ID. Restituisce un Observable che emette un oggetto contenente i dettagli del libro. */
  getBookById(id: number): Observable<{ book: BookDetail }> {
    return this.http.get<{ book: BookDetail }>(`${this.apiUrl}/books/${id}`);
  }

  /* Crea un nuovo libro con i dati forniti. */
  createBook(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, data);
  }

  /* Elimina un libro dato il suo ID. */
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`);
  }

  /* Ottiene le statistiche dell'utente corrente. Restituisce un Observable che emette un oggetto contenente le statistiche. */
  getMyStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/stats/me`);
  }

  /* Ottiene le statistiche globali. Restituisce un Observable che emette un oggetto contenente le statistiche globali. */
  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}
