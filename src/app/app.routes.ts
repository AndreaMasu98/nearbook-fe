import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { AddBookComponent } from './pages/add-book/add-book.component';
import { EditBookComponent } from './pages/edit-book/edit-book.component';
import { AuthGuard } from './guards/auth.guard';

/* Questo file definisce le rotte dell'applicazione, associando ogni percorso a un componente specifico. Le rotte protette da AuthGuard richiedono che l'utente sia autenticato per accedervi. Le rotte pubbliche come login, register e privacy sono accessibili a tutti. La rotta wildcard '**' reindirizza a login per qualsiasi percorso non definito. */
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'book/:id', component: BookDetailComponent, canActivate: [AuthGuard] },
  { path: 'add-book', component: AddBookComponent, canActivate: [AuthGuard] },
  { path: 'edit-book/:id', component: EditBookComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: '/login' }
];
