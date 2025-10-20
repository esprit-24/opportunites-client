import { Component, OnInit } from '@angular/core';
import { Region } from '../../models/region.model';
import { RegionService } from '../../services/region.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-region-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './region-management.component.html',
  styleUrl: './region-management.component.css'
})
export class RegionManagementComponent implements OnInit {

  // Variables pour la gestion des régions
  regions: Region[] = [];
  filteredRegions: Region[] = [];
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
  regionForm: FormGroup;
  isEditing: boolean = false;
  editingRegionId: number | null = null;
  showModal: boolean = false;
  showDetailModal: boolean = false;
  selectedRegion: Region | null = null;

  // Variables pour la gestion des erreurs et états
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private regionService: RegionService) {
    this.regionForm = new FormGroup({
      nom: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadRegions();
    this.setupSearchSubscription();
  }

  // Configuration de la recherche en temps réel
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateRegions();
    });
  }

  // Méthode pour charger toutes les régions
  loadRegions(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.regionService.getAllRegions().subscribe({
      next: (regions: Region[]) => {
        this.regions = regions;
        this.filterAndPaginateRegions();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des régions: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // Méthode pour filtrer et paginer les régions
  filterAndPaginateRegions(): void {
    // Filtrage
    if (this.searchTerm.trim()) {
      this.filteredRegions = this.regions.filter(region =>
        region.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredRegions = [...this.regions];
    }

    // Calcul de la pagination
    this.totalItems = this.filteredRegions.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ajustement de la page courante si nécessaire
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Pagination des résultats
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredRegions = this.filteredRegions.slice(startIndex, endIndex);
  }

  // Méthodes de pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateRegions();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateRegions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateRegions();
    }
  }

  // Méthodes pour les actions CRUD
  addRegion(): void {
    if (this.regionForm.valid) {
      const newRegion: Omit<Region, 'id'> = {
        nom: this.regionForm.value.nom
      };

      this.regionService.addRegion(newRegion).subscribe({
        next: () => {
          this.successMessage = 'Région ajoutée avec succès';
          this.closeModal();
          this.loadRegions();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout de la région: ' + error.message;
        }
      });
    }
  }

  editRegion(region: Region): void {
    this.isEditing = true;
    this.editingRegionId = region.id;
    this.regionForm.patchValue({
      nom: region.nom
    });
    this.showModal = true;
  }

  // Méthodes pour gérer le modal
  openAddModal(): void {
    this.isEditing = false;
    this.editingRegionId = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  // Méthodes pour gérer le modal de détail
  viewRegionDetail(region: Region): void {
    this.selectedRegion = region;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRegion = null;
  }

  updateRegion(): void {
    if (this.regionForm.valid && this.editingRegionId) {
      const updatedRegion: Region = {
        id: this.editingRegionId,
        nom: this.regionForm.value.nom
      };

      this.regionService.updateRegion(this.editingRegionId, updatedRegion).subscribe({
        next: () => {
          this.successMessage = 'Région modifiée avec succès';
          this.closeModal();
          this.loadRegions();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification de la région: ' + error.message;
        }
      });
    }
  }

  deleteRegion(region: Region): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la région "${region.nom}" ?`)) {
      this.regionService.deleteRegion(region.id).subscribe({
        next: () => {
          this.successMessage = 'Région supprimée avec succès';
          this.loadRegions();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de la région: ' + error.message;
        }
      });
    }
  }

  // Méthodes utilitaires
  resetForm(): void {
    this.regionForm.reset();
    this.isEditing = false;
    this.editingRegionId = null;
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
