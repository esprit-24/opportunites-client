import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Opportunite } from '../models/opportunite.model';
import { Domaine } from '../models/domaine.model';
import { Region } from '../models/region.model';
import { Router, RouterLink } from '@angular/router';
import { VilleService } from '../services/ville.service';
import { Ville } from '../models/ville.model';
import { TypeContrat } from '../models/enums.model';
import { DomaineService } from '../services/domaine.service';
import { OpportuniteService } from '../services/opportunite.service';
import { OrganisationService } from '../services/organisation.service';
import { Organisation } from '../models/organisation.model';

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

  totalOpportunites: number = 0;
  displayedNumber: number = 0; // Pour l'animation

  displayedOrganisations: number = 0;
  organisations: Organisation[] = [];
  totalOrganisations: number = 0;

  // Critères de recherche
  selectedDomaineId: number | null = null;
  selectedTypeContrat: string | null = null;
  selectedVilleId: number | null = null;
  selectedSalaireMin: number = 0;



    constructor(
      private villeService: VilleService,
      private domaineService: DomaineService,
      private opportuniteService: OpportuniteService,
      private organisationService: OrganisationService
    ) {}

    ngOnInit(): void {
      this.getVilles();
      this.getDomaines();
      this.loadOpportunites();
      this.loadOrganisations();
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

    // Récupération des offres actives
    loadOpportunites(): void {
      this.opportuniteService.getAllOpportunites().subscribe({
        next: (data: Opportunite[]) => {
          // Filtrer pour ne garder que les opportunités actives
          const actives = data.filter(o => o.statut === 'ACTIVE');

          this.opportunites = actives.slice(0, 2);
          this.totalOpportunites = actives.length;   // Pour le compteur total
        },

        error: (error: any) => {
          console.error('Erreur lors de la récupération des opportunités:', error);
        }
      });
    }

    // Récupération Organisations
    loadOrganisations(): void {
      this.organisationService.getAllOrganisations().subscribe({
        next: (data: Organisation[]) => {
          this.organisations = data;
          this.totalOrganisations = data.length;
        },
        error: (err) => console.error(err)
      });
    }

    // Rechercher
    rechercher(): void {
      this.opportuniteService.getAllOpportunites().subscribe({
        next: (data: Opportunite[]) => {
          // Filtrer les opportunités actives
          let filtered = data.filter(o => o.statut === 'ACTIVE');
    
          // Appliquer les filtres choisis
          if (this.selectedDomaineId) {
            filtered = filtered.filter(o => o.domaine?.id === this.selectedDomaineId);
          }
          if (this.selectedTypeContrat) {
            filtered = filtered.filter(o => o.typeContrat === this.selectedTypeContrat);
          }
          if (this.selectedVilleId) {
            filtered = filtered.filter(o => o.ville?.id === this.selectedVilleId);
          }
          if (this.selectedSalaireMin > 0) {
            filtered = filtered.filter(o => (o.salaire ?? 0) >= this.selectedSalaireMin);
          }
    
          // Mettre à jour la liste affichée
          this.opportunites = filtered;
          this.totalOpportunites = filtered.length;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche d’opportunités:', error);
        }
      });
    }
    
    // Réinitialiser
    resetRecherche(): void {
      this.selectedDomaineId = null;
      this.selectedTypeContrat = null;
      this.selectedVilleId = null;
      this.selectedSalaireMin = 0;
      this.loadOpportunites(); // recharge toutes les opportunités
    }

}
