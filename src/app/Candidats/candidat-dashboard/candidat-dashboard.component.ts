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
import { CandidatureService } from '../../services/candidature.service';
import { AdminService } from '../../services/admin.service';


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

  candidatures: any[] = [];


  totalOpportunites: number = 0;
  displayedNumber: number = 0; // Pour l'animation

  displayedOrganisations: number = 0;
  organisations: Organisation[] = [];
  totalOrganisations: number = 0;

  // Critères de recherche
  selectedDomaineId: number | null = null;
  selectedTypeContrat: string | null = null;
  selectedVilleId: number | null = null;
  selectedSalaireMin: number = 0;


  typeContrats: string[] = Object.values(TypeContrat);

  constructor(
    private router: Router,
    private authService: AuthService,
    private villeService: VilleService,
    private domaineService: DomaineService,
    private opportuniteService: OpportuniteService,
    private organisationService: OrganisationService,
    private candidatureService: CandidatureService,
    private adminService: AdminService
  )
  {}

  ngOnInit(): void {
    this.getCurrentCandidat();
    this.getVilles();
    this.getDomaines();
    this.loadOpportunites();
    this.loadOrganisations();
  }

  // Récupération des candidatures d'un candidat
  loadCandidatures(candidatId: number): void {
    this.candidatureService.getCandidaturesByCandidat(candidatId).subscribe({
      next: (data) => {
        this.candidatures = data
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des candidatures du candidat:', err);
      }
    });
  }

  // Récupération de l'utilisateur courant
  getCurrentCandidat(): void {
    this.adminService.getCurrentAccount().subscribe({
      next: (user) => {
        if (user?.id) {
          this.loadCandidatures(user.id);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', err);
      }
    });
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

  // Déconnexion
  logout(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien

    const confirmation = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (!confirmation) {
      return; // Si l'utilisateur annule, on ne fait rien
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Récupération des opportunités actives
  loadOpportunites(): void {
      this.opportuniteService.getAllOpportunites().subscribe({
        next: (data: Opportunite[]) => {
          // Filtrer pour ne garder que les opportunités actives
          const actives = data.filter(o => o.statut === 'ACTIVE');

          this.opportunites = actives;
          
          this.totalOpportunites = actives.length;
        },

        error: (error: any) => {
          console.error('Erreur lors de la récupération des opportunités:', error);
        }
      });
  }

 // Récupération des organisations
  loadOrganisations(): void {
    this.organisationService.getAllOrganisations().subscribe({
      next: (data: Organisation[]) => {
        this.organisations = data;
        this.totalOrganisations = data.length;

        console.log(this.totalOrganisations)
      },
      error: (err) => console.error(err)
    });
  }

  // Alertes
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'info' | null = null;

  showAlert(message: string, type: 'success' | 'error' | 'info'): void {
    this.alertMessage = message;
    this.alertType = type;

    // L'alerte disparaît automatiquement après 3 secondes
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }

  // Postuler
  postuler(opportunite: Opportunite): void {
    const token = this.authService.getToken();

    if (!token) {
      alert('Vous devez être connecté pour postuler.');
      return;
    }

    // Récupération du profil connecté
    this.adminService.getCurrentAccount().subscribe({
      next: (user) => {
        // Création de la candidature
        const candidature = {
          lettreMotivation: 'Je suis intéressé par cette opportunité.',
          datePostulation: new Date().toISOString(), 
          statutCandidature: 'EN_ATTENTE_VALIDATION_ADMIN',
          opportunite: { id: opportunite.id },
          candidat: { id: user.id }
        };

        // Envoi vers le backend
        this.candidatureService.addCandidature(candidature).subscribe({
          next: () => {
            alert('Votre candidature a été envoyée avec succès !');
          },
          error: (err) => {
            if (err.status === 409) {
              alert('Vous avez déjà postulé à cette opportunité.');
            } else {
              alert('Une erreur est survenue lors de la postulation.');
            }
            console.error('Erreur lors de la postulation :', err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du compte :', err);
        alert('Impossible de récupérer votre profil. Veuillez vous reconnecter.');
      }
    });
  }

  dejaPostule(opportuniteId: number): boolean {
    return this.candidatures.some(c => c.opportunite?.id === opportuniteId);
  }

  rechercher(): void {
    this.opportuniteService.getAllOpportunites().subscribe({
      next: (data: Opportunite[]) => {
        // Filtrer les opportunités actives
        let filtered = data.filter(o => o.statut === 'ACTIVE');

        // Appliquer les filtres choisis
        if (this.selectedDomaineId) {
          filtered = filtered.filter(o => o.domaine?.id === this.selectedDomaineId);
        }
        if (this.selectedTypeContrat) {
          filtered = filtered.filter(o => o.typeContrat === this.selectedTypeContrat);
        }
        if (this.selectedVilleId) {
          filtered = filtered.filter(o => o.ville?.id === this.selectedVilleId);
        }
        if (this.selectedSalaireMin > 0) {
          filtered = filtered.filter(o => (o.salaire ?? 0) >= this.selectedSalaireMin);
        }

        // Mettre à jour la liste affichée
        this.opportunites = filtered;
        this.totalOpportunites = filtered.length;

        if (filtered.length === 0) {
          this.showAlert('Aucune opportunité ne correspond à vos critères.', 'info');
        } else {
          this.showAlert(`${filtered.length} opportunité(s) trouvée(s).`, 'success');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la recherche d’opportunités:', error);
        this.showAlert('Erreur lors de la recherche.', 'error');
      }
    });
  }

  resetRecherche(): void {
    this.selectedDomaineId = null;
    this.selectedTypeContrat = null;
    this.selectedVilleId = null;
    this.selectedSalaireMin = 0;
    this.loadOpportunites(); // recharge toutes les opportunités
  }

}
