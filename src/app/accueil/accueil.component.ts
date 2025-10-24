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

          this.opportunites = actives.slice(0, 2);
          this.totalOpportunites = actives.length;   // Pour le compteur total
          this.startCounter();
        },

        error: (error: any) => {
          console.error('Erreur lors de la récupération des opportunités:', error);
        }
      });
    }

    startCounter(): void {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      this.displayedNumber = count;
      if (count >= this.totalOpportunites) {
        clearInterval(interval);
      }
    }, 50); // vitesse de l'animation
  }

  // Organisations
  loadOrganisations(): void {
    this.organisationService.getAllOrganisations().subscribe({
      next: (data: Organisation[]) => {
        this.organisations = data;
        this.totalOrganisations = data.length;
        this.startOrganisationsCounter();
      },
      error: (err) => console.error(err)
    });
  }

  startOrganisationsCounter(): void {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      this.displayedOrganisations = count;
      if (count >= this.totalOrganisations) clearInterval(interval);
    }, 50);
  }

















}
