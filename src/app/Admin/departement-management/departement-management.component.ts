import { Component, OnInit } from '@angular/core';
import { Departement } from '../../models/departement.model';
import { Region } from '../../models/region.model';
import { DepartementService } from '../../services/departement.service';
import { RegionService } from '../../services/region.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departement-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './departement-management.component.html',
  styleUrl: './departement-management.component.css'
})
export class DepartementManagementComponent implements OnInit {

  // Variables pour la gestion des départements
  departements: Departement[] = [];
  filteredDepartements: Departement[] = [];
  regions: Region[] = [];
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
  departementForm: FormGroup;
  isEditing: boolean = false;
  editingDepartementId: number | null = null;
  showModal: boolean = false;
  showDetailModal: boolean = false;
  selectedDepartement: Departement | null = null;

  // Variables pour la gestion des erreurs et états
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private departementService: DepartementService,
    private regionService: RegionService
  ) {
    this.departementForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      regionId: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadDepartements();
    this.loadRegions();
    this.setupSearchSubscription();
  }

  // Configuration de la recherche en temps réel
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateDepartements();
    });
  }

  // Méthode pour charger toutes les régions
  loadRegions(): void {
    this.regionService.getAllRegions().subscribe({
      next: (regions: Region[]) => {
        this.regions = regions;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des régions:', error);
      }
    });
  }

  // Méthode pour charger tous les départements
  loadDepartements(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.departementService.getAllDepartements().subscribe({
      next: (departements: Departement[]) => {
        this.departements = departements;
        this.filterAndPaginateDepartements();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des départements: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // Méthode pour filtrer et paginer les départements
  filterAndPaginateDepartements(): void {
    // Filtrage
    if (this.searchTerm.trim()) {
      this.filteredDepartements = this.departements.filter(departement =>
        departement.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        departement.region.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDepartements = [...this.departements];
    }

    // Calcul de la pagination
    this.totalItems = this.filteredDepartements.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ajustement de la page courante si nécessaire
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Pagination des résultats
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredDepartements = this.filteredDepartements.slice(startIndex, endIndex);
  }

  // Méthodes de pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateDepartements();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateDepartements();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateDepartements();
    }
  }

  // Méthodes pour les actions CRUD
  addDepartement(): void {
    if (this.departementForm.valid) {
      const selectedRegion = this.regions.find(r => r.id === +this.departementForm.value.regionId);
      if (!selectedRegion) {
        this.errorMessage = 'Région sélectionnée invalide';
        return;
      }

      const newDepartement: Omit<Departement, 'id'> = {
        nom: this.departementForm.value.nom,
        region: selectedRegion
      };

      this.departementService.addDepartement(newDepartement).subscribe({
        next: () => {
          this.successMessage = 'Département ajouté avec succès';
          this.closeModal();
          this.loadDepartements();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout du département: ' + error.message;
        }
      });
    }
  }

  editDepartement(departement: Departement): void {
    this.isEditing = true;
    this.editingDepartementId = departement.id;
    this.departementForm.patchValue({
      nom: departement.nom,
      regionId: departement.region.id
    });
    this.showModal = true;
  }

  // Méthodes pour gérer le modal
  openAddModal(): void {
    this.isEditing = false;
    this.editingDepartementId = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  // Méthodes pour gérer le modal de détail
  viewDepartementDetail(departement: Departement): void {
    this.selectedDepartement = departement;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedDepartement = null;
  }

  updateDepartement(): void {
    if (this.departementForm.valid && this.editingDepartementId) {
      const selectedRegion = this.regions.find(r => r.id === +this.departementForm.value.regionId);
      if (!selectedRegion) {
        this.errorMessage = 'Région sélectionnée invalide';
        return;
      }

      const updatedDepartement: Departement = {
        id: this.editingDepartementId,
        nom: this.departementForm.value.nom,
        region: selectedRegion
      };

      this.departementService.updateDepartement(this.editingDepartementId, updatedDepartement).subscribe({
        next: () => {
          this.successMessage = 'Département modifié avec succès';
          this.closeModal();
          this.loadDepartements();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification du département: ' + error.message;
        }
      });
    }
  }

  deleteDepartement(departement: Departement): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le département "${departement.nom}" ?`)) {
      this.departementService.deleteDepartement(departement.id).subscribe({
        next: () => {
          this.successMessage = 'Département supprimé avec succès';
          this.loadDepartements();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du département: ' + error.message;
        }
      });
    }
  }

  // Méthodes utilitaires
  resetForm(): void {
    this.departementForm.reset();
    this.isEditing = false;
    this.editingDepartementId = null;
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
