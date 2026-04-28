import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { GeolocationService } from '../../services/geolocation.service';
import { AuthService } from '../../services/auth.service';
import * as L from 'leaflet';
import { Book } from '../../models/book.interface';
import { Location } from '../../models/location.interface';

/* Il componente HomeComponent è la pagina principale dell'applicazione, dove gli utenti possono cercare libri nelle vicinanze e visualizzarli su una mappa. Utilizza Leaflet per la visualizzazione della mappa e interagisce con i servizi di geolocalizzazione e gestione dei libri. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('map', { static: false }) mapElement?: ElementRef;

  books: Book[] = [];
  raggio = 2000;
  categoria = 'tutti';
  searchQuery = '';
  searchMode: 'name' | 'distance' = 'distance'; // 'name' o 'distance'
  userLocation: Location | null = null;
  map: L.Map | null = null;
  currentUser$ = this.authService.currentUser$;
  selectedBook: Book | null = null;
  markers: L.Marker[] = [];
  userMarker: L.CircleMarker | null = null;

  constructor(
    private bookService: BookService,
    private geoService: GeolocationService,
    private authService: AuthService,
    private router: Router
  ) {}

  /* Al caricamento del componente, inizializza la mappa e ottiene la posizione dell'utente per mostrare i libri nelle vicinanze. */
  ngOnInit(): void {
    const iconDefault = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.mergeOptions({ icon: iconDefault });

    this.getCurrentLocation();
  }

  /* Ottiene la posizione attuale dell'utente utilizzando il servizio di geolocalizzazione. Se la geolocalizzazione fallisce, imposta una posizione di default (Milano) e continua comunque a inizializzare la mappa e cercare i libri. */
  getCurrentLocation(): void {
    this.geoService.getCurrentLocation().subscribe({
      next: (location) => {
        this.userLocation = location;
        this.initMap();
        this.searchBooks();
      },
      error: () => {
        this.userLocation = { latitude: 45.4642, longitude: 9.1900 };
        this.initMap();
        this.searchBooks();
      }
    });
  }

  /* Inizializza la mappa Leaflet centrata sulla posizione dell'utente e aggiunge un marker per indicare la posizione. */
  initMap(): void {
    if (!this.userLocation || this.map) return;

    setTimeout(() => {
      this.map = L.map('map', { zoomControl: true }).setView(
        [this.userLocation!.latitude, this.userLocation!.longitude],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Marker posizione utente
      this.userMarker = L.circleMarker(
        [this.userLocation!.latitude, this.userLocation!.longitude],
        {
          radius: 8,
          fillColor: '#2563eb',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }
      ).addTo(this.map).bindPopup('<strong>La tua posizione</strong>');
    }, 100);
  }

  /* Esegue la ricerca dei libri in base alla modalità selezionata (per nome o per distanza) e aggiorna la mappa con i risultati. Se la ricerca è per nome, utilizza il servizio di ricerca libri con il nome e la categoria. Se la ricerca è per distanza, utilizza il servizio di libri vicini con le coordinate dell'utente, il raggio e la categoria. In entrambi i casi, aggiorna i marker sulla mappa con i risultati ottenuti. */
  searchBooks(): void {
    // Ricerca per nome
    if (this.searchMode === 'name') {
      if (!this.searchQuery.trim()) {
        alert('Inserisci un nome per cercare');
        return;
      }

      this.bookService.searchBooks(this.searchQuery, this.categoria).subscribe({
        next: (response) => {
          this.books = response.books;
          this.updateMapMarkers();
        },
        error: (err) => {
          console.error('Errore nel recupero libri:', err);
        }
      });
      return;
    }

    // Ricerca per distanza
    if (!this.userLocation) return;

    // Se la ricerca è per distanza, utilizza il servizio di libri vicini con le coordinate dell'utente, il raggio e la categoria. In entrambi i casi, aggiorna i marker sulla mappa con i risultati ottenuti.
    this.bookService.getNearbyBooks(
      this.userLocation.latitude,
      this.userLocation.longitude,
      this.raggio,
      this.categoria
    ).subscribe({
      next: (response) => {
        this.books = response.books;
        this.updateMapMarkers();
      },
      error: (err) => {
        console.error('Errore nel recupero libri:', err);
      }
    });
  }

  /* Aggiorna i marker sulla mappa in base ai libri attualmente visualizzati. Rimuove i marker precedenti e ne aggiunge di nuovi per ogni libro nella lista. Se ci sono libri con coordinate valide, adatta la vista della mappa per includere tutti i marker e la posizione dell'utente. */
  updateMapMarkers(): void {
    if (!this.map) return;

    // Rimuovi markers precedenti
    this.markers.forEach(marker => this.map?.removeLayer(marker));
    this.markers = [];

    this.books.forEach(book => {
      if (book.latitudine == null || book.longitudine == null) return;

      const marker = L.marker([book.latitudine, book.longitudine]).addTo(this.map!);

      // Popup personalizzato con informazioni sul libro
      marker.bindPopup(`
        <div style="min-width:150px; font-family: sans-serif;">
          <p style="font-size:13px; font-weight:600; margin:0 0 2px;">${book.titolo}</p>
          <p style="font-size:12px; color:#666; margin:0 0 4px;">${book.autore}</p>
          <p style="font-size:11px; color:#999; margin:0 0 6px;">
            ${book.distanza_metri ? (book.distanza_metri / 1000).toFixed(1) : '0'} km di distanza
          </p>
          <a href="/book/${book.id}" style="font-size:12px; color:#111; font-weight:500;">
            Dettagli →
          </a>
        </div>
      `);

      // Click sul marker: evidenzia libro in lista
      marker.on('click', () => {
        this.selectBook(book);
      });

      this.markers.push(marker);
    });

    // Adatta la mappa per mostrare tutti i markers + posizione utente
    if (this.markers.length > 0 && this.userLocation) {
      const allPoints: L.LatLngExpression[] = [
        [this.userLocation.latitude, this.userLocation.longitude],
        ...this.markers.map(m => m.getLatLng() as L.LatLngExpression)
      ];
      const bounds = L.latLngBounds(allPoints);
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  selectBook(book: Book): void {
    this.selectedBook = book;

    // Apri popup del marker corrispondente
    const marker = this.markers.find(m => {
      const ll = m.getLatLng();
      return ll.lat === book.latitudine && ll.lng === book.longitudine;
    });
    marker?.openPopup();
  }

  /* Esegue il logout dell'utente utilizzando il servizio di autenticazione e reindirizza alla pagina di login. */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}