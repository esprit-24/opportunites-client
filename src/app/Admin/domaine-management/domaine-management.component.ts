import { Component, OnInit } from '@angular/core';
import { Domaine } from '../../models/domaine.model';
import { DomaineService } from '../../services/domaine.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-domaine-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './domaine-management.component.html',
  styleUrl: './domaine-management.component.css'
})
export class DomaineManagementComponent implements OnInit {

  // Variables pour la gestion des domaines
  domaines: Domaine[] = [];
  filteredDomaines: Domaine[] = [];
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
  domaineForm: FormGroup;
  isEditing: boolean = false;
  editingDomaineId: number | null = null;
  showModal: boolean = false;

  // Variables pour la gestion des erreurs et états
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private domaineService: DomaineService) {
    this.domaineForm = new FormGroup({
      intitule: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadDomaines();
    this.setupSearchSubscription();
  }

  // Configuration de la recherche en temps réel
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateDomaines();
    });
  }

  // Méthode pour charger tous les domaines
  loadDomaines(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.domaineService.getAllDomaines().subscribe({
      next: (domaines: Domaine[]) => {
        this.domaines = domaines;
        this.filterAndPaginateDomaines();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des domaines: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // Méthode pour filtrer et paginer les domaines
  filterAndPaginateDomaines(): void {
    // Filtrage
    if (this.searchTerm.trim()) {
      this.filteredDomaines = this.domaines.filter(domaine =>
        domaine.intitule.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        domaine.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDomaines = [...this.domaines];
    }

    // Calcul de la pagination
    this.totalItems = this.filteredDomaines.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ajustement de la page courante si nécessaire
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Pagination des résultats
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredDomaines = this.filteredDomaines.slice(startIndex, endIndex);
  }

  // Méthodes de pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateDomaines();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateDomaines();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateDomaines();
    }
  }

  // Méthodes pour les actions CRUD
  addDomaine(): void {
    if (this.domaineForm.valid) {
      const newDomaine: Omit<Domaine, 'id'> = {
        intitule: this.domaineForm.value.intitule,
        description: this.domaineForm.value.description
      };

      this.domaineService.addDomaine(newDomaine).subscribe({
        next: () => {
          this.successMessage = 'Domaine ajouté avec succès';
          this.closeModal();
          this.loadDomaines();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout du domaine: ' + error.message;
        }
      });
    }
  }

  editDomaine(domaine: Domaine): void {
    this.isEditing = true;
    this.editingDomaineId = domaine.id;
    this.domaineForm.patchValue({
      intitule: domaine.intitule,
      description: domaine.description
    });
    this.showModal = true;
  }

  // Méthodes pour gérer le modal
  openAddModal(): void {
    this.isEditing = false;
    this.editingDomaineId = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  updateDomaine(): void {
    if (this.domaineForm.valid && this.editingDomaineId) {
      const updatedDomaine: Domaine = {
        id: this.editingDomaineId,
        intitule: this.domaineForm.value.intitule,
        description: this.domaineForm.value.description
      };

      this.domaineService.updateDomaine(this.editingDomaineId, updatedDomaine).subscribe({
        next: () => {
          this.successMessage = 'Domaine modifié avec succès';
          this.closeModal();
          this.loadDomaines();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification du domaine: ' + error.message;
        }
      });
    }
  }

  deleteDomaine(domaine: Domaine): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le domaine "${domaine.intitule}" ?`)) {
      this.domaineService.deleteDomaine(domaine.id).subscribe({
        next: () => {
          this.successMessage = 'Domaine supprimé avec succès';
          this.loadDomaines();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du domaine: ' + error.message;
        }
      });
    }
  }

  // Méthodes utilitaires
  resetForm(): void {
    this.domaineForm.reset();
    this.isEditing = false;
    this.editingDomaineId = null;
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
