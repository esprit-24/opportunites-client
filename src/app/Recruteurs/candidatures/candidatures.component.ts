import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule],  // nécessaire pour *ngFor, *ngIf, etc.
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css']
})
export class CandidaturesComponent {
  candidatures = [
    { nom: 'Ali Diop', email: 'ali@example.com', poste: 'Développeur', dateSoumission: new Date() },
    { nom: 'Fatou Ndiaye', email: 'fatou@example.com', poste: 'Designer', dateSoumission: new Date() }
  ];

  constructor(private router: Router) {}

  retourProfil() {
    this.router.navigate(['/recruteur']);
  }
  voirDetails(candidature: any) {
    this.router.navigate(['/recruteur/candidatures/candidature-details', candidature.email]);
  }
}
