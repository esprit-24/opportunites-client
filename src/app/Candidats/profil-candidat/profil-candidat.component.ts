import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CandidatureService } from '../../services/candidature.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { Opportunite } from '../../models/opportunite.model';
import { Candidature } from '../../models/candidature.model';
import { OpportuniteService } from '../../services/opportunite.service';

@Component({
  selector: 'app-profil-candidat',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profil-candidat.component.html',
  styleUrl: './profil-candidat.component.css'
})
export class ProfilCandidatComponent implements OnInit {

  user: any = null;
  candidatures: Candidature[] = [];
  opportunites: Opportunite[] = [];
  isLoading: boolean = true;

  constructor(
    private adminService: AdminService,
    private candidatureService: CandidatureService,
    private opportuniteService: OpportuniteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger les opportunités avant les candidatures
    this.loadOpportunites();
  }

  loadOpportunites(): void {
    this.opportuniteService.getAllOpportunites().subscribe({
      next: (data) => {
        this.opportunites = data;
        this.loadProfilCandidat(); // Ensuite, on charge le profil
      },
      error: (err) => {
        console.error('Erreur lors du chargement des opportunités:', err);
        this.loadProfilCandidat();
      }
    });
  }

  loadProfilCandidat(): void {
    this.adminService.getCurrentAccount().subscribe({
      next: (user) => {
        this.user = user;
        if (user?.id) {
          this.loadCandidatures(user.id);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil :', err);
        alert('Erreur : impossible de charger votre profil.');
        this.isLoading = false;
      }
    });
  }

  loadCandidatures(candidatId: number): void {
    this.candidatureService.getCandidaturesByCandidat(candidatId).subscribe({
      next: (data) => {
        this.candidatures = data;

        // Enrichissement avec les infos des opportunités
        this.candidatures.forEach(candidature => {
          const opp = this.opportunites.find(o => o.id === candidature.opportunite?.id);
          if (opp) {
            candidature.opportunite = opp; // on remplace l’objet partiel
          }
        });

        console.log('Candidatures enrichies :', this.candidatures);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des candidatures :', err);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  getStatutBadgeClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE_VALIDATION_ADMIN': return 'bg-warning text-dark';
      case 'VALIDEE_ADMIN': return 'bg-success';
      case 'REJETEE_ADMIN': return 'bg-danger';
      case 'VUE_RECRUTEUR': return 'bg-info text-dark';
      case 'REFUSEE_RECRUTEUR': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }
}
