import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { CandidatDashboardComponent } from './Candidats/candidat-dashboard/candidat-dashboard.component';
import { RecruteurDashboardComponent } from './Recruteurs/recruteur-dashboard/recruteur-dashboard.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: '', component: AccueilComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'candidat', component: CandidatDashboardComponent},
    { path: 'recruteur', component: RecruteurDashboardComponent }
];
