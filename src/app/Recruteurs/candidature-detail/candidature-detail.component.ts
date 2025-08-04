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

  constructor(private route: ActivatedRoute, private router: Router) {
    this.candidatureId = Number(this.route.snapshot.paramMap.get('id'));
    // Tu peux ici charger les détails depuis un service en fonction de l’id
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
