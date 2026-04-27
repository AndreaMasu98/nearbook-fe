import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { environment } from '../../../environments/environment';

/* Questo componente gestisce la pagina di modifica di un libro. Permette all'utente di modificare i dettagli del libro e caricare una nuova copertina. La geolocalizzazione rimane visibile ma non modificabile. */
@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  editBookForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  coverPreview: string | null = null;
  coverFile: File | null = null;
  
  lat: number | null = null;
  lng: number | null = null;
  
  bookId: number | null = null;
  bookLoading = true;
  
  categories = ['Fantasy', 'Romance', 'Thriller', 'Saggistica'];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Ottiene l'ID del libro dalla route
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.bookId) {
      this.error = 'ID libro non valido';
      return;
    }

    this.initializeForm();
    this.loadBook();
  }

  /* Inizializza il form reattivo con i campi necessari e le relative validazioni. */
  initializeForm(): void {
    this.editBookForm = this.fb.group({
      titolo: ['', [Validators.required, Validators.minLength(3)]],
      autore: ['', [Validators.required, Validators.minLength(2)]],
      anno: ['', [Validators.pattern(/^\d{4}$/)]],
      categoria: ['', Validators.required],
      descrizione: ['', [Validators.maxLength(500)]],
      disponibile: [false]
    });
  }

  /* Carica i dati del libro dal servizio e pre-popola il form. */
  loadBook(): void {
    if (!this.bookId) return;

    this.bookService.getBookById(this.bookId).subscribe({
      next: (response) => {
        const book = response.book;
        
        // Pre-popola il form
        this.editBookForm.patchValue({
          titolo: book.titolo,
          autore: book.autore,
          anno: book.anno || '',
          categoria: book.categoria,
          descrizione: book.descrizione || '',
          disponibile: book.disponibile || false
        });

        // Imposta la geolocalizzazione (read-only)
        this.lat = book.lat;
        this.lng = book.lng;

        // Mostra preview della copertina attuale
        if (book.cover_path) {
          this.coverPreview = this.getImageUrl(book.cover_path);
        }

        this.bookLoading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento del libro';
        this.bookLoading = false;
      }
    });
  }

  /* Costruisce l'URL corretto per le immagini. */
  getImageUrl(path: string | null): string {
    if (!path) return 'assets/placeholder-book.png';
    if (path.startsWith('http')) return path;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/uploads/${path}`;
  }

  /* Gestisce la selezione del file di copertina. Verifica che il file sia un'immagine e crea un'anteprima. Se il file non è valido, mostra un messaggio di errore. */
  onCoverSelected(event: any): void {
    const file = event.target.files[0];
    console.log('File:', file?.name, 'Type:', file?.type, 'Size:', file?.size);

    if (file && file.type.startsWith('image/')) {
      this.coverFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.error = 'Seleziona un file immagine valido';
    }
  }

  /* Rimuove la copertina selezionata e resetta l'anteprima. */
  removeCover(): void {
    this.coverFile = null;
    // Mantieni la preview precedente se non è stata cambiata
  }

  /* Gestisce la sottomissione del form. Verifica che il form sia valido e invia i dati al servizio per aggiornare il libro. */
  onSubmit(): void {
    if (this.editBookForm.invalid || !this.bookId) {
      this.error = 'Compila tutti i campi obbligatori';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    /* Crea un oggetto FormData per inviare i dati del libro, inclusa la nuova copertina se presente. */
    const formData = new FormData();
    formData.append('titolo', this.editBookForm.get('titolo')?.value);
    formData.append('autore', this.editBookForm.get('autore')?.value);
    formData.append('anno', this.editBookForm.get('anno')?.value || '');
    formData.append('categoria', this.editBookForm.get('categoria')?.value);
    formData.append('descrizione', this.editBookForm.get('descrizione')?.value || '');
    formData.append('disponibile', this.editBookForm.get('disponibile')?.value ? 'true' : 'false');

    if (this.coverFile) {
      formData.append('cover', this.coverFile);
    }

    /* Invia i dati al servizio per aggiornare il libro. Gestisce la risposta per mostrare messaggi di successo o errore e naviga alla pagina del profilo dopo un breve ritardo in caso di successo. */
    this.bookService.updateBook(this.bookId, formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Libro aggiornato con successo!';
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Errore nell\'aggiornamento del libro';
      }
    });
  }

  /* Naviga alla pagina del profilo quando l'utente decide di annullare la modifica del libro. */
  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
