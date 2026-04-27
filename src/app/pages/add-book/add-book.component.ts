import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { GeolocationService } from '../../services/geolocation.service';

/* Questo componente gestisce la pagina di aggiunta di un nuovo libro. Permette all'utente di inserire i dettagli del libro, caricare una copertina e ottenere la posizione attuale per associarla al libro. */
@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  addBookForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  coverPreview: string | null = null;
  coverFile: File | null = null;
  
  lat: number | null = null;
  lng: number | null = null;
  locationError: string | null = null;
  
  categories = ['Fantasy', 'Romance', 'Thriller', 'Saggistica'];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private geolocationService: GeolocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCurrentLocation();
  }

  /* Inizializza il form reattivo con i campi necessari e le relative validazioni. */
  initializeForm(): void {
    this.addBookForm = this.fb.group({
      titolo: ['', [Validators.required, Validators.minLength(3)]],
      autore: ['', [Validators.required, Validators.minLength(2)]],
      anno: ['', [Validators.pattern(/^\d{4}$/)]],
      categoria: ['', Validators.required],
      descrizione: ['', [Validators.maxLength(500)]]
    });
  }

  /* Ottiene la posizione attuale dell'utente utilizzando il servizio di geolocalizzazione. Se la geolocalizzazione fallisce, mostra un messaggio di errore. */
  getCurrentLocation(): void {
    this.geolocationService.getCurrentLocation().subscribe({
      next: (coords) => {
        this.lat = coords.latitude;
        this.lng = coords.longitude;
        this.locationError = null;
      },
      error: (err) => {
        this.locationError = 'Impossibile ottenere la geolocalizzazione. Carica comunque il libro con coordinate manuali.';
      }
    });
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
    this.coverPreview = null;
  }

  /* Gestisce la sottomissione del form. Verifica che il form sia valido e che la geolocalizzazione sia disponibile. Se tutto è corretto, invia i dati al servizio per creare un nuovo libro. Gestisce lo stato di caricamento e mostra messaggi di successo o errore in base alla risposta del server. */
  onSubmit(): void {
    if (this.addBookForm.invalid || !this.lat || !this.lng) {
      this.error = 'Compila tutti i campi obbligatori e consenti la geolocalizzazione';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    /* Crea un oggetto FormData per inviare i dati del libro, inclusa la copertina se presente. */
    const formData = new FormData();
    formData.append('titolo', this.addBookForm.get('titolo')?.value);
    formData.append('autore', this.addBookForm.get('autore')?.value);
    formData.append('anno', this.addBookForm.get('anno')?.value || '');
    formData.append('categoria', this.addBookForm.get('categoria')?.value);
    formData.append('descrizione', this.addBookForm.get('descrizione')?.value || '');
    formData.append('lat', this.lat.toString());
    formData.append('lng', this.lng.toString());

    if (this.coverFile) {
      formData.append('cover', this.coverFile);
    }

    /* Invia i dati al servizio per creare un nuovo libro. Gestisce la risposta per mostrare messaggi di successo o errore e naviga alla pagina del profilo dopo un breve ritardo in caso di successo. */
    this.bookService.createBook(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Libro caricato con successo!';
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Errore nel caricamento del libro';
      }
    });
  }

  /* Naviga alla pagina del profilo quando l'utente decide di annullare l'aggiunta del libro. */
  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
