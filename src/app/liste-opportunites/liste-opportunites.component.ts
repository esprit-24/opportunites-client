import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Opportunite } from '../models/opportunite.model';
import { Domaine } from '../models/domaine.model';
import { Region } from '../models/region.model';
import { Ville } from '../models/ville.model';
import { TypeContrat } from '../models/enums.model';
import { VilleService } from '../services/ville.service';
import { DomaineService } from '../services/domaine.service';
import { OpportuniteService } from '../services/opportunite.service';


@Component({
  selector: 'app-liste-opportunites',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './liste-opportunites.component.html',
  styleUrl: './liste-opportunites.component.css'
})
export class ListeOpportunitesComponent implements OnInit {

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
    // Logique d'initialisation ici
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


    loadOpportunites(): void {
      this.opportuniteService.getAllOpportunites().subscribe({
        next: (data: Opportunite[]) => {
          // Filtrer pour ne garder que les opportunités actives
          const actives = data.filter(o => o.statut === 'ACTIVE');
          this.opportunites = actives;

        },

        error: (error: any) => {
          console.error('Erreur lors de la récupération des opportunités:', error);
        }
      });
    }

}
