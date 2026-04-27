import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.interface';
import { Loan } from '../../models/loan.interface';

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
  myBooks: Book[] = [];
  stats: any = null;

  constructor(
    private bookService: BookService,
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /* Carica le richieste di prestito ricevute e le statistiche dell'utente. In caso di errore, logga l'errore sulla console */
  loadData(): void {
    this.loanService.getReceivedLoans().subscribe({
      next: (response) => {
        this.receivedLoans = response.richieste;
      },
      error: (err) => console.error('Errore caricamento richieste', err)
    });

    this.bookService.getMyStats().subscribe({
      next: (response) => {
        this.stats = response;
        this.myBooks = response.libri || [];
      },
      error: (err) => console.error('Errore caricamento statistiche', err)
    });
  }

  /* Accetta una richiesta di prestito, aggiornando lo stato della richiesta tramite il servizio di prestiti. */
  acceptLoan(id: number): void {
    this.loanService.updateLoanStatus(id, 'accettata').subscribe({
      next: () => {
        this.loadData();
        alert('Prestito accettato!');
      },
      error: (err) => alert('Errore: ' + err.error?.error)
    });
  }

  /* Rifiuta una richiesta di prestito, aggiornando lo stato della richiesta tramite il servizio di prestiti. */
  rejectLoan(id: number): void {
    this.loanService.updateLoanStatus(id, 'rifiutata').subscribe({
      next: () => {
        this.loadData();
        alert('Prestito rifiutato!');
      },
      error: (err) => alert('Errore: ' + err.error?.error)
    });
  }

  /* Effettua il logout dell'utente, chiamando il servizio di autenticazione e reindirizzando alla pagina di login */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
