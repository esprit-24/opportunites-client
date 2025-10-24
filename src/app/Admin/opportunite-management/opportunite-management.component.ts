import { Component, OnInit } from '@angular/core';
import { Opportunite } from '../../models/opportunite.model';
import { Domaine } from '../../models/domaine.model';
import { Organisation } from '../../models/organisation.model';
import { Ville } from '../../models/ville.model';
import { OpportuniteService } from '../../services/opportunite.service';
import { DomaineService } from '../../services/domaine.service';
import { OrganisationService } from '../../services/organisation.service';
import { VilleService } from '../../services/ville.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NiveauEtude, Statut, TypeContrat } from '../../models/enums.model';

@Component({
  selector: 'app-opportunite-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './opportunite-management.component.html',
  styleUrl: './opportunite-management.component.css'
})
export class OpportuniteManagementComponent implements OnInit {
  // === Données principales ===
  opportunites: Opportunite[] = [];
  filteredOpportunites: Opportunite[] = [];
  domaines: Domaine[] = [];
  organisations: Organisation[] = [];
  villes: Ville[] = [];

  // === Pagination ===
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // === Recherche ===
  searchTerm: string = '';
  searchControl = new FormControl('');

  // === Formulaire ===
  opportuniteForm: FormGroup;
  isEditing: boolean = false;
  editingOpportuniteId: number | null = null;
  showModal: boolean = false;
  showDetailModal: boolean = false;
  selectedOpportunite: Opportunite | null = null;

  // === États ===
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // === Enums ===
  niveauxEtude = Object.values(NiveauEtude);
  typesContrat = Object.values(TypeContrat);
  statuts = Object.values(Statut);

  constructor(
    private opportuniteService: OpportuniteService,
    private domaineService: DomaineService,
    private organisationService: OrganisationService,
    private villeService: VilleService
  ) {
    // === Initialisation du FormGroup ===
    this.opportuniteForm = new FormGroup({
      titre: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      dateDebut: new FormControl('', [Validators.required]),
      dateFin: new FormControl(''),
      adresse: new FormControl(''),
      niveauEtudeRequis: new FormControl(''),
      nombrePostes: new FormControl('', [Validators.required, Validators.min(1)]),
      salaire: new FormControl(''),
      statut: new FormControl(Statut.ACTIVE),
      typeContrat: new FormControl('', [Validators.required]),
      domaineId: new FormControl('', [Validators.required]),
      organisationId: new FormControl('', [Validators.required]),
      villeId: new FormControl('', [Validators.required])
    });
  }

  // === Cycle de vie ===
  ngOnInit(): void {
    this.loadOpportunites();
    this.loadDomaines();
    this.loadOrganisations();
    this.loadVilles();
    this.setupSearchSubscription();
  }

  // === Recherche en temps réel ===
  setupSearchSubscription(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerm = term || '';
      this.currentPage = 1;
      this.filterAndPaginateOpportunites();
    });
  }

  // === Chargements ===
  loadOpportunites(): void {
    this.isLoading = true;
    this.opportuniteService.getAllOpportunites().subscribe({
      next: (data) => {
        this.opportunites = data;
        this.filterAndPaginateOpportunites();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des opportunités: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  loadDomaines(): void {
    this.domaineService.getAllDomaines().subscribe({
      next: (domaines) => (this.domaines = domaines),
      error: (e) => console.error('Erreur chargement domaines:', e)
    });
  }

  loadOrganisations(): void {
    this.organisationService.getAllOrganisations().subscribe({
      next: (orgs) => (this.organisations = orgs),
      error: (e) => console.error('Erreur chargement organisations:', e)
    });
  }

  loadVilles(): void {
    this.villeService.getAllVilles().subscribe({
      next: (villes) => (this.villes = villes),
      error: (e) => console.error('Erreur chargement villes:', e)
    });
  }

  // === Filtrage + Pagination ===
  filterAndPaginateOpportunites(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredOpportunites = this.opportunites.filter(opp =>
      opp.titre.toLowerCase().includes(term) ||
      opp.organisation?.nom?.toLowerCase().includes(term)
    );

    this.totalItems = this.filteredOpportunites.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredOpportunites = this.filteredOpportunites.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginateOpportunites();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginateOpportunites();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndPaginateOpportunites();
    }
  }

  // === Ajout ===
  addOpportunite(): void {
    if (this.opportuniteForm.valid) {
      const form = this.opportuniteForm.value;

      const newOpp: Omit<Opportunite, 'id'> = {
        titre: form.titre,
        description: form.description,
        dateDebut: form.dateDebut + 'T00:00:00Z',
        dateFin: form.dateFin ? form.dateFin + 'T00:00:00Z' : null,
        adresse: form.adresse,
        niveauEtudeRequis: form.niveauEtudeRequis,
        nombrePostes: form.nombrePostes,
        salaire: form.salaire,
        statut: form.statut,
        typeContrat: form.typeContrat,
        domaine: this.domaines.find(d => d.id === +this.opportuniteForm.value.domaineId),
        organisation: this.organisations.find(o => o.id === +this.opportuniteForm.value.organisationId),
        ville: this.villes.find(v => v.id === +this.opportuniteForm.value.villeId)
      };

      this.opportuniteService.addOpportunite(newOpp).subscribe({
        next: () => {
          this.successMessage = '✅ Opportunité ajoutée avec succès';
          this.closeModal();
          this.loadOpportunites();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = '❌ Erreur lors de l’ajout : ' + error.message;
        }
      });
    }
  }

  // === Modification ===
  editOpportunite(opp: Opportunite): void {
    this.isEditing = true;
    this.editingOpportuniteId = opp.id;
    this.opportuniteForm.patchValue({
      titre: opp.titre,
      description: opp.description,
      dateDebut: opp.dateDebut?.substring(0, 10),
      dateFin: opp.dateFin?.substring(0, 10),
      adresse: opp.adresse,
      niveauEtudeRequis: opp.niveauEtudeRequis,
      nombrePostes: opp.nombrePostes,
      salaire: opp.salaire,
      statut: opp.statut,
      typeContrat: opp.typeContrat,
      domaineId: opp.domaine?.id,
      organisationId: opp.organisation?.id,
      villeId: opp.ville?.id
    });
    this.showModal = true;
  }

  updateOpportunite(): void {
    if (this.opportuniteForm.valid && this.editingOpportuniteId) {
      const form = this.opportuniteForm.value;

      const updatedOpp: Opportunite = {
        id: this.editingOpportuniteId,
        titre: form.titre,
        description: form.description,
        dateDebut: form.dateDebut + 'T00:00:00Z',
        dateFin: form.dateFin ? form.dateFin + 'T00:00:00Z' : null,
        adresse: form.adresse,
        niveauEtudeRequis: form.niveauEtudeRequis,
        nombrePostes: form.nombrePostes,
        salaire: form.salaire,
        statut: form.statut,
        typeContrat: form.typeContrat,
        domaine: this.domaines.find(d => d.id === +this.opportuniteForm.value.domaineId),
        organisation: this.organisations.find(o => o.id === +this.opportuniteForm.value.organisationId),
        ville: this.villes.find(v => v.id === +this.opportuniteForm.value.villeId)
      };

      this.opportuniteService.updateOpportunite(this.editingOpportuniteId, updatedOpp).subscribe({
        next: () => {
          this.successMessage = '✅ Opportunité mise à jour avec succès';
          this.closeModal();
          this.loadOpportunites();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = '❌ Erreur lors de la modification : ' + error.message;
        }
      });
    }
  }

  // === Suppression ===
  deleteOpportunite(opp: Opportunite): void {
    if (confirm(`Supprimer l’opportunité "${opp.titre}" ?`)) {
      this.opportuniteService.deleteOpportunite(opp.id).subscribe({
        next: () => {
          this.successMessage = '🗑️ Opportunité supprimée avec succès';
          this.loadOpportunites();
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = '❌ Erreur lors de la suppression : ' + error.message;
        }
      });
    }
  }

  // === Modals ===
  openAddModal(): void {
    this.isEditing = false;
    this.editingOpportuniteId = null;
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  viewOpportuniteDetail(opp: Opportunite): void {
    this.selectedOpportunite = opp;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOpportunite = null;
  }

  // === Utils ===
  resetForm(): void {
    this.opportuniteForm.reset({ statut: Statut.ACTIVE });
    this.isEditing = false;
    this.editingOpportuniteId = null;
  }

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
}
