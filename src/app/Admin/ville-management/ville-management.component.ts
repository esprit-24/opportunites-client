import { Component, OnInit } from '@angular/core';
import { Ville } from '../../models/ville.model';
import { Departement } from '../../models/departement.model';
import { VilleService } from '../../services/ville.service';
import { DepartementService } from '../../services/departement.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ville-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './ville-management.component.html',
  styleUrl: './ville-management.component.css'
})
export class VilleManagementComponent implements OnInit {

  // Variables pour la gestion des villes
  villes: Ville[] = [];
  filteredVilles: Ville[] = [];
  departements: Departement[] = [];
  count: number = 0;

  // Variables pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // Variables pour la recherche
  searchTerm: string = '';
  searchControl = new FormControl('');

  // Variables pour les formulaires
  villeForm: FormGroup;
  isEditing: boolean = false;
  editingVilleId: number | null = null;
  showModal: boolean = false;
  showDetailModal: boolean = false;
  selectedVille: Ville | null = null;

  // Variables pour la gestion des erreurs et états
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private villeService: VilleService,
    private departementService: DepartementService
  ) {
    this.villeForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      departementId: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadVilles();
    this.loadDepartements();
    this.setupSearchSubscription();
  }

  // Configuration de la recherche en temps réel
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateVilles();
    });
  }

  // Méthode pour charger tous les départements
  loadDepartements(): void {
    this.departementService.getAllDepartements().subscribe({
      next: (departements: Departement[]) => {
        this.departements = departements;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des départements:', error);
      }
    });
  }

  // Méthode pour charger toutes les villes
  loadVilles(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.villeService.getAllVilles().subscribe({
      next: (villes: Ville[]) => {
        this.villes = villes;
        this.filterAndPaginateVilles();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des villes: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // Méthode pour filtrer et paginer les villes
  filterAndPaginateVilles(): void {
    // Filtrage
    if (this.searchTerm.trim()) {
      this.filteredVilles = this.villes.filter(ville =>
        ville.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ville.departement.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ville.departement.region.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredVilles = [...this.villes];
    }

    // Calcul de la pagination
    this.totalItems = this.filteredVilles.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ajustement de la page courante si nécessaire
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Pagination des résultats
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredVilles = this.filteredVilles.slice(startIndex, endIndex);
  }

  // Méthodes de pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateVilles();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateVilles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateVilles();
    }
  }

  // Méthodes pour les actions CRUD
  addVille(): void {
    if (this.villeForm.valid) {
      const selectedDepartement = this.departements.find(d => d.id === +this.villeForm.value.departementId);
      if (!selectedDepartement) {
        this.errorMessage = 'Département sélectionné invalide';
        return;
      }

      const newVille: Omit<Ville, 'id'> = {
        nom: this.villeForm.value.nom,
        departement: selectedDepartement
      };

      this.villeService.addVille(newVille).subscribe({
        next: () => {
          this.successMessage = 'Ville ajoutée avec succès';
          this.closeModal();
          this.loadVilles();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout de la ville: ' + error.message;
        }
      });
    }
  }

  editVille(ville: Ville): void {
    this.isEditing = true;
    this.editingVilleId = ville.id;
    this.villeForm.patchValue({
      nom: ville.nom,
      departementId: ville.departement.id
    });
    this.showModal = true;
  }

  // Méthodes pour gérer le modal
  openAddModal(): void {
    this.isEditing = false;
    this.editingVilleId = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  // Méthodes pour gérer le modal de détail
  viewVilleDetail(ville: Ville): void {
    this.selectedVille = ville;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedVille = null;
  }

  updateVille(): void {
    if (this.villeForm.valid && this.editingVilleId) {
      const selectedDepartement = this.departements.find(d => d.id === +this.villeForm.value.departementId);
      if (!selectedDepartement) {
        this.errorMessage = 'Département sélectionné invalide';
        return;
      }

      const updatedVille: Ville = {
        id: this.editingVilleId,
        nom: this.villeForm.value.nom,
        departement: selectedDepartement
      };

      this.villeService.updateVille(this.editingVilleId, updatedVille).subscribe({
        next: () => {
          this.successMessage = 'Ville modifiée avec succès';
          this.closeModal();
          this.loadVilles();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification de la ville: ' + error.message;
        }
      });
    }
  }

  deleteVille(ville: Ville): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la ville "${ville.nom}" ?`)) {
      this.villeService.deleteVille(ville.id).subscribe({
        next: () => {
          this.successMessage = 'Ville supprimée avec succès';
          this.loadVilles();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de la ville: ' + error.message;
        }
      });
    }
  }

  // Méthodes utilitaires
  resetForm(): void {
    this.villeForm.reset();
    this.isEditing = false;
    this.editingVilleId = null;
  }

  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 5000);
  }

  // Getters pour le template
  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
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

}
