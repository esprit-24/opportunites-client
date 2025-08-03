import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recruteur-dashboard',
  templateUrl: './recruteur-dashboard.component.html',
  styleUrls: ['./recruteur-dashboard.component.css']
})
export class RecruteurDashboardComponent {
  constructor(private router: Router) {}

  allerAjouterOffre() {
    this.router.navigate(['/recruteur/ajout-offre']);
  }
}
