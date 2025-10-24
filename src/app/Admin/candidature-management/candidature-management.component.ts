import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Candidature } from '../../models/candidature.model';
import { Opportunite } from '../../models/opportunite.model';
import { User } from '../../models/user.model';
import { StatutCandidature } from '../../models/enums.model';
import { CandidatureService } from '../../services/candidature.service';
import { OpportuniteService } from '../../services/opportunite.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-candidature-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './candidature-management.component.html',
  styleUrl: './candidature-management.component.css'
})
export class CandidatureManagementComponent implements OnInit {

  public StatutCandidature = StatutCandidature;
  
  // === Données principales ===
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  opportunites: Opportunite[] = [];
  users: User[] = [];

  // === Pagination ===
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // === Recherche ===
  searchTerm: string = '';
  searchControl = new FormControl('');

  // === États ===
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // === Modale Détail ===
  showDetailModal: boolean = false;
  selectedCandidature: Candidature | null = null;

  // === Enums ===
  statutsCandidature = Object.values(StatutCandidature);

  constructor(
    private candidatureService: CandidatureService,
    private opportuniteService: OpportuniteService,
    private adminService: AdminService
  ) {}

  // === Cycle de vie ===
  ngOnInit(): void {
    this.loadCandidatures();
    this.loadOpportunites();
    this.getAllUsers();
    this.setupSearchSubscription();
  }

  // === Recherche ===
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateCandidatures();
    });
  }

  // === Chargements ===
  loadCandidatures(): void {
    this.isLoading = true;
    this.candidatureService.getAllCandidatures().subscribe({
      next: (data) => {
        this.candidatures = data;
        this.filterAndPaginateCandidatures();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des candidatures: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  loadOpportunites(): void {
    this.opportuniteService.getAllOpportunites().subscribe({
      next: (opps) => (this.opportunites = opps),
      error: (e) => console.error('Erreur chargement opportunités:', e)
    });
  }

  // === Charger tous les utilisateurs (au lieu des candidats)
  getAllUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  // === Filtrage + Pagination ===
  filterAndPaginateCandidatures(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCandidatures = this.candidatures.filter(c =>
      c.statutCandidature.toLowerCase().includes(term)
    );

    this.totalItems = this.filteredCandidatures.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCandidatures = this.filteredCandidatures.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateCandidatures();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateCandidatures();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateCandidatures();
    }
  }

  // === Actions Admin ===
  updateStatut(cand: Candidature, newStatus: StatutCandidature): void {
    const updatedCandidature: Candidature = { ...cand, statutCandidature: newStatus };

    this.candidatureService.updateCandidature(cand.id!, updatedCandidature).subscribe({
      next: () => {
        this.successMessage =
          newStatus === StatutCandidature.VALIDEE_ADMIN
            ? '✅ Candidature validée avec succès'
            : '❌ Candidature rejetée';
        this.loadCandidatures();
        this.clearMessages();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du statut : ' + error.message;
      }
    });
  }

  // === Voir détails ===
  viewCandidatureDetail(cand: Candidature): void {
    this.selectedCandidature = cand;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedCandidature = null;
  }

  // === Utils ===
  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 4000);
  }

  // === Getters pagination ===
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  canAdminChangeStatus(cand: Candidature, targetStatus: StatutCandidature): boolean {
    // cas où le recruteur a déjà agi -> admin ne modifie pas
    const statut = cand.statutCandidature;
    if (
      statut === StatutCandidature.VUE_RECRUTEUR ||
      statut === StatutCandidature.ACCEPTEE_RECRUTEUR ||
      statut === StatutCandidature.REFUSEE_RECRUTEUR
    ) {
      return false;
    }
  
    // cas possible : en attente -> peut valider ou rejeter
    if (statut === StatutCandidature.EN_ATTENTE_VALIDATION_ADMIN) {
      return true;
    }
  
    // cas possible : validée -> peut rejeter
    if (statut === StatutCandidature.VALIDEE_ADMIN && targetStatus === StatutCandidature.REJETEE_ADMIN) {
      return true;
    }
  
    // cas possible : rejetée -> peut valider
    if (statut === StatutCandidature.REJETEE_ADMIN && targetStatus === StatutCandidature.VALIDEE_ADMIN) {
      return true;
    }
  
    // sinon interdit
    return false;
  }
  
}
