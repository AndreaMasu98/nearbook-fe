import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.interface';
import { Loan } from '../../models/loan.interface';
import { environment } from '../../../environments/environment';

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

  getImageUrl(path: string | null): string {
    if (!path) return 'assets/placeholder-book.png';
    if (path.startsWith('http')) return path;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${path}`;
  }

  editBook(bookId: number): void {
    // Reindirizza a una pagina di edit (da implementare)
    this.router.navigate(['/edit-book', bookId]);
  }

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

  cancelDelete(bookId: number): void {
    this.deleteConfirm[bookId] = false;
  }

  acceptLoan(id: number): void {
    this.loanService.updateLoanStatus(id, 'accettata').subscribe({
      next: () => {
        this.loadData();
        alert('Prestito accettato!');
      },
      error: (err) => alert('Errore: ' + err.error?.error)
    });
  }

  rejectLoan(id: number): void {
    this.loanService.updateLoanStatus(id, 'rifiutata').subscribe({
      next: () => {
        this.loadData();
        alert('Prestito rifiutato!');
      },
      error: (err) => alert('Errore: ' + err.error?.error)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
