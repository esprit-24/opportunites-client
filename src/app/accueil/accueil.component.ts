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

  constructor(
    private villeService: VilleService,
    private domaineService: DomaineService
  ) {}

  ngOnInit(): void {
      this.getVilles();
      this.getDomaines();
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
}
