import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { CandidatDashboardComponent } from './Candidats/candidat-dashboard/candidat-dashboard.component';
import { RecruteurDashboardComponent } from './Recruteurs/recruteur-dashboard/recruteur-dashboard.component';
import { AjoutOffreComponent  }  from './Recruteurs/ajout-offre/ajout-offre.component';
import { ProfilRecruteurComponent } from './Recruteurs/profil-recruteur/profil-recruteur.component';
import { CandidaturesComponent } from './Recruteurs/candidatures/candidatures.component';
import { CandidatureDetailComponent } from './Recruteurs/candidature-detail/candidature-detail.component';

import { RegisterComponent } from './register/register.component';
import { adminGuard } from './guards/admin.guard';
import { candidatGuard } from './guards/candidat.guard';
import { recruteurGuard } from './guards/recruteur.guard';

export const routes: Routes = [
    { path: '', component: AccueilComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'candidat', component: CandidatDashboardComponent, canActivate: [candidatGuard]},
    { path: 'recruteur', component: ProfilRecruteurComponent, },
    {path: 'recruteur/dashboard', component: RecruteurDashboardComponent,  },
    { path: 'recruteur/ajout-offre', component: AjoutOffreComponent,},
    { path: 'recruteur/candidatures', component: CandidaturesComponent },
    { path: 'recruteur/candidatures/candidature-details/:email', component: CandidatureDetailComponent }

   ];
