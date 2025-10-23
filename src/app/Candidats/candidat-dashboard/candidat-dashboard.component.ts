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
import { Organisation } from '../../models/organisation.model';
import { OrganisationService } from '../../services/organisation.service';


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

  totalOpportunites: number = 0;
  displayedNumber: number = 0; // Pour l'animation

  displayedOrganisations: number = 0;
  organisations: Organisation[] = [];
  totalOrganisations: number = 0;



  typeContrats: string[] = Object.values(TypeContrat);

  constructor(
    private router: Router,
    private authService: AuthService,
    private villeService: VilleService,
    private domaineService: DomaineService,
    private opportuniteService: OpportuniteService,
    private organisationService: OrganisationService
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

      // Lancer l'animation seulement si total > 0
      if (this.totalOrganisations > 0) {
        this.startOrganisationsCounter();
      }
    },
    error: (err) => console.error(err)
  });
}

startOrganisationsCounter(): void {
  this.displayedOrganisations = 0;
  const duration = 1000; // durée de l'animation en ms
  const stepTime = Math.floor(duration / this.totalOrganisations);
  let count = 0;

  const interval = setInterval(() => {
    count++;
    this.displayedOrganisations = count;
    if (count >= this.totalOrganisations) {
      clearInterval(interval);
    }
  }, stepTime);
}







}
