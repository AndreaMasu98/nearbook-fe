import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

export interface MyStatistics {
  totale_libri: number;
  totale_visualizzazioni: number;
  totale_richieste: number;
  per_categoria: Array<{
    categoria: string;
    count: number;
  }>;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  statistics: MyStatistics | null = null;
  loading = true;
  error: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  /* Carica le statistiche dell'utente chiamando il servizio dei libri. In caso di successo, salva le statistiche nella variabile di stato e imposta loading a false. */
  loadStatistics(): void {
    this.bookService.getMyStats().subscribe({
      next: (response) => {
        this.statistics = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle tue statistiche';
        this.loading = false;
        console.error('Errore:', err);
      }
    });
  }

  /* Calcola la larghezza percentuale per una categoria in base al numero di libri in quella categoria rispetto al massimo numero di libri in una categoria. Se non ci sono categorie, restituisce 0 */
  getPercentageWidth(count: number): number {
    if (!this.statistics?.per_categoria || this.statistics.per_categoria.length === 0) return 0;
    const max = Math.max(...this.statistics.per_categoria.map(c => c.count));
    return (count / max) * 100;
  }

  /* Calcola il numero medio di visualizzazioni per libro. Se non ci sono libri, restituisce 0 */
  getAverageViews(): number {
    if (!this.statistics || this.statistics.totale_libri === 0) return 0;
    return this.statistics.totale_visualizzazioni / this.statistics.totale_libri;
  }

  /* Calcola il tasso di engagement come rapporto tra il numero totale di richieste e il numero totale di libri, espresso in percentuale. Se non ci sono libri, restituisce 0 */
  getEngagementRate(): number {
    if (!this.statistics || this.statistics.totale_libri === 0) return 0;
    return (this.statistics.totale_richieste / this.statistics.totale_libri) * 100;
  }

  /* Restituisce la categoria con il maggior numero di libri. Se non ci sono categorie, restituisce 'N/A' */
  getMainCategory(): string {
    if (!this.statistics?.per_categoria || this.statistics.per_categoria.length === 0) return 'N/A';
    return this.statistics.per_categoria[0].categoria;
  }
}
