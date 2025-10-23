import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Opportunite } from '../../models/opportunite.model';
import { TypeContrat } from '../../models/enums.model';
import { VilleService } from '../../services/ville.service';
import { Ville } from '../../models/ville.model';
import { AuthService } from '../../services/auth.service';
import { Domaine } from '../../models/domaine.model';
import { Region } from '../../models/region.model';
import { DomaineService } from '../../services/domaine.service';
import { OpportuniteService } from '../../services/opportunite.service';


@Component({
  selector: 'app-candidat-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './candidat-dashboard.component.html',
  styleUrl: './candidat-dashboard.component.css'
})
export class CandidatDashboardComponent implements OnInit {

  opportunites: Opportunite[] = [];
  domaines: Domaine[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];



  typeContrats: string[] = Object.values(TypeContrat);

  constructor(
    private router: Router,
    private authService: AuthService,
    private villeService: VilleService,
    private domaineService: DomaineService,
    private opportuniteService: OpportuniteService
  )
  {}

  ngOnInit(): void {
    this.getVilles();
    this.getDomaines();
    this.loadOpportunites();
  }

  // Récupération des villes
  getVilles(): void {
    this.villeService.getAllVilles().subscribe({
      next: (villes: Ville[]) => {
        this.villes = villes;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des villes:', error);
      }
    });
  }

    // Récupération des domaines
    getDomaines(): void {
      this.domaineService.getAllDomaines().subscribe({
        next: (domaines: Domaine[]) => {
          this.domaines = domaines;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des domaines:', error);
        }
      });
    }

  logout(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien

    const confirmation = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (!confirmation) {
      return; // Si l'utilisateur annule, on ne fait rien
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }

   // Filtrage des opportunités
    loadOpportunites(): void {
      this.opportuniteService.getAllOpportunites().subscribe({
        next: (data: Opportunite[]) => {
          this.opportunites = data.slice(0, 2); // Afficher seulement les 3 premières opportunités
        },

        error: (error: any) => {
          console.error('Erreur lors de la récupération des opportunités:', error);
        }
      });
    }

    voirPlus(offre: any): void {
     offre.showFullDescription = !offre.showFullDescription;
  }

showToast = false;
toastOffreTitre = '';

postuler(offre: Opportunite): void {
  this.toastOffreTitre = offre.titre;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000); // masque le toast après 3 secondes
}




}
