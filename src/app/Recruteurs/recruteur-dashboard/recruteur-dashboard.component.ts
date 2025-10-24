import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecruteurService } from '../../services/recruteur.service';
import { OpportuniteService } from '../../services/opportunite.service';
import { Recruteur } from '../../models/recruteur.model';
import { Opportunite } from '../../models/opportunite.model';

@Component({
  selector: 'app-recruteur-dashboard',
  templateUrl: './recruteur-dashboard.component.html',
  styleUrls: ['./recruteur-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]  // nécessaire pour *ngFor, *ngIf et pipe date
})
export class RecruteurDashboardComponent implements OnInit {

  recruteur!: Recruteur;               // recruteur connecté
  opportunites: Opportunite[] = [];    // liste des opportunités
  candidatures: any[] = [];      // liste des candidatures (à implémenter)

  constructor(
    private router: Router,
    private recruteurService: RecruteurService,
    private opportuniteService: OpportuniteService
  ) {}

  ngOnInit(): void {
    this.getRecruteurConnecte();
  }

  // Récupère le recruteur connecté
  getRecruteurConnecte(): void {
    const userId = this.recruteurService.getUserIdConnecte(); // adapte selon ton AuthService
    if (userId === null) return;

    this.recruteurService.getRecruteurByUserId(userId).subscribe({
      next: (recruteur: Recruteur) => {
        this.recruteur = recruteur;
        this.chargerOpportunites();
      },
      error: (err: any) => console.error(err)
    });
  }

  // Charge les opportunités liées à l'organisation du recruteur
  chargerOpportunites(): void {
    this.recruteurService.getOrganisationIdByRecruteurId(this.recruteur.id!).subscribe({
      next: (organisationId: number) => {
        this.opportuniteService.getOpportunitesByOrganisation(organisationId).subscribe({
          next: (opps: Opportunite[]) => this.opportunites = opps,
          error: (err: any) => console.error(err)
        });
      },
      error: (err: any) => console.error(err)
    });
  }



  voirCandidatures(): void {
    this.router.navigate(['/recruteur/candidatures']);
  }
}
