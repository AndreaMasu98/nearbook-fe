import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { LoanService } from '../../services/loan.service';
import { BookDetail } from '../../models/book-detail.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: BookDetail | null = null;
  showLoanModal = false;
  loanMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private loanService: LoanService,
    private router: Router
  ) {}

  /* Al caricamento del componente, recupera l'ID del libro dalla route e ne carica i dettagli */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookById(id).subscribe({
      next: (response) => {
        this.book = response.book;
      },
      error: (err) => {
        alert('Errore nel caricamento del libro');
        this.router.navigate(['/home']);
      }
    });
  }

  /* Mostra il modal per richiedere un prestito */
  requestLoan(): void {
    this.showLoanModal = true;
  }

  /* Conferma la richiesta di prestito, inviando il messaggio dell'utente come parametro */
  confirmLoan(): void {
    if (!this.book) return;

    this.loanService.requestLoan(this.book.id, this.loanMessage).subscribe({
      next: () => {
        alert('Richiesta di prestito inviata!');
        this.showLoanModal = false;
        this.loanMessage = '';
      },
      error: (err) => {
        alert('Errore: ' + err.error?.error);
      }
    });
  }

  getImageUrl(path: string | null): string {
    if (!path) return 'assets/placeholder-book.png';
    if (path.startsWith('http')) return path;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${path}`;
  }
}
