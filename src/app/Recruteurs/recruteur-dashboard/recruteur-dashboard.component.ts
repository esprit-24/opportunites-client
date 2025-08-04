import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recruteur-dashboard',
  templateUrl: './recruteur-dashboard.component.html',
  styleUrls: ['./recruteur-dashboard.component.css'],
  imports: [CommonModule]
})
export class RecruteurDashboardComponent {
  constructor(private router: Router) {}

  allerAjouterOffre() {
    this.router.navigate(['/recruteur/ajout-offre']);
  }

  voirCandidatures() {
    this.router.navigate(['/recruteur/candidatures']);
  }
}
