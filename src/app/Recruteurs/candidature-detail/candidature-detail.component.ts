import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidature-detail.component.html',
  styleUrls: ['./candidature-detail.component.css']
})
export class CandidatureDetailComponent {
  candidatureId: number;
  candidaturenom: string;
  candidatureemail: string;
  candidatureposte:string;
  dateSoumission:Date;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.candidatureId = Number(this.route.snapshot.paramMap.get('id'));
    // Tu peux ici charger les détails depuis un service en fonction de l’id
    this.candidaturenom= String( this.route.snapshot.paramMap.get('nom'));
    this.candidatureemail= String( this.route.snapshot.paramMap.get('email'));
    this.candidatureposte= String( this.route.snapshot.paramMap.get('poste'));
    this.dateSoumission= new Date( String( this.route.snapshot.paramMap.get('dateSoumission')));
    }

  validerCandidature() {
    alert('Candidature validée !');
    // À remplacer par un appel à l’API
  }

  proposerEntretien() {
    alert('Entretien proposé !');
    // À remplacer aussi par un appel à l’API
  }

  retour() {
    this.router.navigate(['/recruteur/candidatures']);
  }
}
