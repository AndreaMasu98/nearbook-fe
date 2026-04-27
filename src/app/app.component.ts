import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nearbook';
  isAuthenticated$: Observable<boolean>;

  /* Nel costruttore, inizializza l'Observable isAuthenticated$ che emette true se l'utente è autenticato, altrimenti false. Si sottoscrive anche a currentUser$ del servizio di autenticazione per aggiornare lo stato di autenticazione ogni volta che cambia l'utente corrente. */
  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = new Observable(observer => {
      observer.next(this.authService.isAuthenticated());
      this.authService.currentUser$.subscribe(() => {
        observer.next(this.authService.isAuthenticated());
      });
    });
  }
}
