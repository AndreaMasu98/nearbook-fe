import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    /* Inizializza il form di registrazione con i campi nome, cognome, email e password. Tutti i campi sono obbligatori. L'email deve essere in formato valido e la password deve avere almeno 6 caratteri */
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /* Gestisce l'evento di submit del form di registrazione. Se il form è valido, chiama il servizio di autenticazione per effettuare la registrazione. In caso di successo, reindirizza alla home page. In caso di errore, mostra un messaggio di errore */
  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { nome, cognome, email, password } = this.registerForm.value;
    
    this.authService.register(nome, cognome, email, password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Errore durante la registrazione';
        this.loading = false;
      }
    });
  }
}
