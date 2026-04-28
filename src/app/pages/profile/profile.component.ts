import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.interface';
import { Loan } from '../../models/loan.interface';
import { environment } from '../../../environments/environment';

/* Il componente ProfileComponent gestisce la pagina del profilo utente, dove l'utente può vedere i propri libri, le richieste di prestito ricevute e le statistiche. Permette anche di accettare o rifiutare le richieste di prestito e di eliminare i propri libri. Utilizza i servizi di BookService, LoanService e AuthService per interagire con l'API e gestire i dati dell'utente. */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;
  receivedLoans: Loan[] = [];
  myBooks: any[] = [];
  stats: any = null;
  loadingBooks = false;
  deleteConfirm: { [key: number]: boolean } = {};

  constructor(
    private bookService: BookService,
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /* Carica i dati necessari per la pagina del profilo: le richieste di prestito ricevute, le statistiche e i libri dell'utente. Gestisce anche gli stati di caricamento e gli errori. */
  loadData(): void {
    this.loanService.getReceivedLoans().subscribe({
      next: (response) => {
        this.receivedLoans = response.richieste;
      },
      error: (err) => console.error('Errore caricamento richieste', err)
    });

    // Carica statistiche
    this.bookService.getMyStats().subscribe({
      next: (response) => {
        this.stats = response;
      },
      error: (err) => console.error('Errore caricamento statistiche', err)
    });

    // Carica i miei libri
    this.loadingBooks = true;
    this.bookService.getMyBooks().subscribe({
      next: (response) => {
        this.myBooks = response.books;
        this.loadingBooks = false;
      },
      error: (err) => {
        console.error('Errore caricamento libri', err);
        this.loadingBooks = false;
      }
    });
  }

  /* Restituisce l'URL completo dell'immagine di copertina del libro. Se il percorso è null, restituisce un'immagine placeholder. Se il percorso è un URL completo, lo restituisce direttamente. Altrimenti, costruisce l'URL completo basato sul percorso relativo e l'URL base dell'API. */
  getImageUrl(path: string | null): string {
    if (!path) return 'assets/placeholder-book.png';
    if (path.startsWith('http')) return path;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${path}`;
  }

  /* Naviga alla pagina di modifica del libro specificato. */
  editBook(bookId: number): void {
    this.router.navigate(['/edit-book', bookId]);
  }

  /* Gestisce l'eliminazione di un libro. Se l'utente clicca per la prima volta sul pulsante di eliminazione, viene chiesto di confermare l'azione. Se l'utente conferma, viene inviata la richiesta di eliminazione al servizio. In caso di successo, viene ricaricata la lista dei libri. In caso di errore, viene mostrato un messaggio di errore. */
  deleteBook(bookId: number): void {
    if (!this.deleteConfirm[bookId]) {
      this.deleteConfirm[bookId] = true;
      return;
    }

    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        alert('Libro eliminato con successo!');
        this.loadData();
      },
      error: (err) => alert('Errore eliminazione: ' + (err.error?.error || 'Errore sconosciuto'))
    });
  }

  /* Annulla la conferma di eliminazione per un libro specifico. */
  cancelDelete(bookId: number): void {
    this.deleteConfirm[bookId] = false;
  }

  /* Accetta una richiesta di prestito specificata dall'ID. In caso di successo, ricarica i dati del profilo e mostra un messaggio di conferma. In caso di errore, mostra un messaggio di errore. */
  acceptLoan(id: number): void {
    this.loanService.updateLoanStatus(id, 'accettata').subscribe({
      next: () => {
        this.loadData();
        alert('Prestito accettato!');
      },
      error: (err) => alert('Errore: ' + err.error?.error)
    });
  }

  /* Rifiuta una richiesta di prestito specificata dall'ID. In caso di successo, ricarica i dati del profilo e mostra un messaggio di conferma. In caso di errore, mostra un messaggio di errore. */
  rejectLoan(id: number): void {
    this.loanService.updateLoanStatus(id, 'rifiutata').subscribe({
      next: () => {
        this.loadData();
        alert('Prestito rifiutato!');
      },
      error: (err) => alert('Errore: ' + err.error?.error)
    });
  }

  /* Effettua il logout dell'utente, chiamando il servizio di autenticazione e reindirizzando alla pagina di login. */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
