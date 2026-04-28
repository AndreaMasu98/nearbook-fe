import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/* Il componente NavbarComponent gestisce la barra di navigazione del sito, mostrando i link alle pagine principali e le informazioni sull'utente autenticato. Permette anche di effettuare il logout. Utilizza il servizio di autenticazione per ottenere le informazioni sull'utente e gestire lo stato di autenticazione. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  mobileMenuOpen = false;
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService, private router: Router) {}

  /* Toglie il menu mobile quando viene cliccato il bottone del menu. */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /* Effettua il logout dell'utente chiamando il metodo logout del servizio di autenticazione, poi reindirizza alla pagina di login e chiude il menu mobile. */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.mobileMenuOpen = false;
  }
}
