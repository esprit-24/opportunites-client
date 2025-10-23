import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobService } from '../services/job.service';
import { Opportunite } from '../models/opportunite.model';
import { Domaine } from '../models/domaine.model';
import { Region } from '../models/region.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { VilleService } from '../services/ville.service';
import { Ville } from '../models/ville.model';
import { TypeContrat } from '../models/enums.model';
import { DomaineService } from '../services/domaine.service';
import { OpportuniteService } from '../services/opportunite.service';

@Component({
  selector: 'app-accueil',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {

  opportunites: Opportunite[] = [];
  domaines: Domaine[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];

  typeContrats: string[] = Object.values(TypeContrat);
  router: any;

  constructor(
    private villeService: VilleService,
    private domaineService: DomaineService,
    private opportuniteService: OpportuniteService
  ) {}

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

    // Filtrage des opportunités
    loadOpportunites(): void {
      this.opportuniteService.getAllOpportunites().subscribe({
        next: (data) => {
          this.opportunites = data.slice(0, 2); // Afficher seulement les 3 premières opportunités
        },

        error: (error) => {
          console.error('Erreur lors de la récupération des opportunités:', error);
        }
      });
    }

    postuler(offre: Opportunite): void {
      this.router.navigate(['/login']);
    }

    voirPlus(offre: any): void {
     offre.showFullDescription = !offre.showFullDescription;
  }

}
