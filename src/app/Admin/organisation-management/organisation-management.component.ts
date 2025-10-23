import { Component, OnInit } from '@angular/core';
import { Organisation } from '../../models/organisation.model';
import { Ville } from '../../models/ville.model';
import { OrganisationService } from '../../services/organisation.service';
import { VilleService } from '../../services/ville.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organisation-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './organisation-management.component.html',
  styleUrl: './organisation-management.component.css'
})
export class OrganisationManagementComponent implements OnInit {

  // === Données principales ===
  organisations: Organisation[] = [];
  filteredOrganisations: Organisation[] = [];
  villes: Ville[] = [];

  // === Pagination ===
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // === Recherche ===
  searchTerm: string = '';
  searchControl = new FormControl('');

  // === Formulaire et modals ===
  organisationForm: FormGroup;
  isEditing: boolean = false;
  editingOrganisationId: number | null = null;
  showModal: boolean = false;
  showDetailModal: boolean = false;
  selectedOrganisation: Organisation | null = null;

  // === États ===
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private organisationService: OrganisationService,
    private villeService: VilleService
  ) {
    this.organisationForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      presentation: new FormControl('', [Validators.required]),
      secteurActivite: new FormControl(''),
      logoUrl: new FormControl(''),
      adresse: new FormControl('', [Validators.required]),
      siteWeb: new FormControl(''),
      emailContact: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl(''),
      villeId: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadOrganisations();
    this.loadVilles();
    this.setupSearchSubscription();
  }

  // === Recherche temps réel ===
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateOrganisations();
    });
  }

  // === Chargement des villes ===
  loadVilles(): void {
    this.villeService.getAllVilles().subscribe({
      next: (villes: Ville[]) => {
        this.villes = villes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des villes:', error);
      }
    });
  }

  // === Chargement des organisations ===
  loadOrganisations(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.organisationService.getAllOrganisations().subscribe({
      next: (organisations: Organisation[]) => {
        this.organisations = organisations;
        this.filterAndPaginateOrganisations();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des organisations: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // === Filtrage et pagination ===
  filterAndPaginateOrganisations(): void {
    if (this.searchTerm.trim()) {
      this.filteredOrganisations = this.organisations.filter(org =>
        org.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (org.ville?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredOrganisations = [...this.organisations];
    }

    this.totalItems = this.filteredOrganisations.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredOrganisations = this.filteredOrganisations.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateOrganisations();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateOrganisations();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateOrganisations();
    }
  }

  // === CRUD ===
  addOrganisation(): void {
    if (this.organisationForm.valid) {
      const selectedVille = this.villes.find(v => v.id === +this.organisationForm.value.villeId);
      if (!selectedVille) {
        this.errorMessage = 'Ville sélectionnée invalide';
        return;
      }

      const newOrganisation: Omit<Organisation, 'id'> = {
        nom: this.organisationForm.value.nom,
        presentation: this.organisationForm.value.presentation,
        secteurActivite: this.organisationForm.value.secteurActivite,
        logoUrl: this.organisationForm.value.logoUrl,
        adresse: this.organisationForm.value.adresse,
        siteWeb: this.organisationForm.value.siteWeb,
        emailContact: this.organisationForm.value.emailContact,
        telephone: this.organisationForm.value.telephone,
        ville: selectedVille
      };

      this.organisationService.addOrganisation(newOrganisation).subscribe({
        next: () => {
          this.successMessage = 'Organisation ajoutée avec succès';
          this.closeModal();
          this.loadOrganisations();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout: ' + error.message;
        }
      });
    }
  }

  editOrganisation(org: Organisation): void {
    this.isEditing = true;
    this.editingOrganisationId = org.id;
    this.organisationForm.patchValue({
      nom: org.nom,
      presentation: org.presentation,
      secteurActivite: org.secteurActivite,
      logoUrl: org.logoUrl,
      adresse: org.adresse,
      siteWeb: org.siteWeb,
      emailContact: org.emailContact,
      telephone: org.telephone,
      villeId: org.ville?.id
    });
    this.showModal = true;
  }

  updateOrganisation(): void {
    if (this.organisationForm.valid && this.editingOrganisationId) {
      const selectedVille = this.villes.find(v => v.id === +this.organisationForm.value.villeId);
      if (!selectedVille) {
        this.errorMessage = 'Ville sélectionnée invalide';
        return;
      }

      const updatedOrganisation: Organisation = {
        id: this.editingOrganisationId,
        nom: this.organisationForm.value.nom,
        presentation: this.organisationForm.value.presentation,
        secteurActivite: this.organisationForm.value.secteurActivite,
        logoUrl: this.organisationForm.value.logoUrl,
        adresse: this.organisationForm.value.adresse,
        siteWeb: this.organisationForm.value.siteWeb,
        emailContact: this.organisationForm.value.emailContact,
        telephone: this.organisationForm.value.telephone,
        ville: selectedVille
      };

      this.organisationService.updateOrganisation(this.editingOrganisationId, updatedOrganisation).subscribe({
        next: () => {
          this.successMessage = 'Organisation modifiée avec succès';
          this.closeModal();
          this.loadOrganisations();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification: ' + error.message;
        }
      });
    }
  }

  deleteOrganisation(org: Organisation): void {
    if (confirm(`Supprimer l'organisation "${org.nom}" ?`)) {
      this.organisationService.deleteOrganisation(org.id).subscribe({
        next: () => {
          this.successMessage = 'Organisation supprimée avec succès';
          this.loadOrganisations();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression: ' + error.message;
        }
      });
    }
  }

  // === Modals ===
  openAddModal(): void {
    this.isEditing = false;
    this.editingOrganisationId = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  viewOrganisationDetail(org: Organisation): void {
    this.selectedOrganisation = org;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrganisation = null;
  }

  // === Utils ===
  resetForm(): void {
    this.organisationForm.reset();
    this.isEditing = false;
    this.editingOrganisationId = null;
  }

  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 5000);
  }

  // === Getters pour la pagination ===
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
}
