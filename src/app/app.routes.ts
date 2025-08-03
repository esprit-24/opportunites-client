import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { RecruteurDashboardComponent } from './Recruteurs/recruteur-dashboard/recruteur-dashboard.component';
import { AjoutOffreComponent  }  from './Recruteurs/ajout-offre/ajout-offre.component';

import { RegisterComponent } from './register/register.component';
import { adminGuard } from './guards/admin.guard';
import { candidatGuard } from './guards/candidat.guard';
import { recruteurGuard } from './guards/recruteur.guard';
import { CandidatDashboardComponent } from './Candidats/candidat-dashboard/candidat-dashboard.component';
import { UserManagementComponent } from './Admin/user-management/user-management.component';

export const routes: Routes = [
    { path: '', component: AccueilComponent },
    { path: 'accueil', component: AccueilComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Routes protégées par des guards
    { path: 'admin', component: AdminDashboardComponent, children: [
        { path: 'users', component: UserManagementComponent },
    ] ,canActivate: [adminGuard] },
    { path: 'candidat', component: CandidatDashboardComponent, canActivate: [candidatGuard]},
    { path: 'recruteur', component: RecruteurDashboardComponent, canActivate: [recruteurGuard]},
    { path: 'recruteur/ajout-offre', component: AjoutOffreComponent,},
   ];
