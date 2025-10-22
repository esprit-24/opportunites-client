import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganisationService } from '../services/organisation.service';
import { Organisation } from '../models/organisation.model';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-recruteur',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-recruteur.component.html',
  styleUrl: './register-recruteur.component.css'
})
export class RegisterRecruteurComponent implements OnInit {

  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  organisations: Organisation[] = [];

  constructor(
    private fb: FormBuilder,
    private registerRecruteurService: RegisterService,
    private organisationService: OrganisationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganisations();
    this.initForm();
  }

  // Initialisation du formulaire
  private initForm(): void {
    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: [''],
      lastName: [''],
      titreProfessionnel: [''],
      biographie: [''],
      organisationId: [null],
    }, { validator: this.passwordsMatchValidator });
  }

  // Vérifie si les mots de passe correspondent
  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Charger les organisations depuis le backend
  loadOrganisations(): void {
    this.organisationService.getAllOrganisations().subscribe({
      next: (organisations) => {
        this.organisations = organisations;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des organisations.';
      }
    });
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    const { confirmPassword, ...data } = this.registerForm.value;
    const formData = new FormData();

    formData.append('login', data.login);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('titreProfessionnel', data.titreProfessionnel);
    formData.append('biographie', data.biographie);
    formData.append('organisationId', Number(data.organisationId).toString());

    this.registerRecruteurService.registerRecruteur(formData).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie. En attente d’activation.';
        this.errorMessage = null;
        this.registerForm.reset();

        this.router.navigate(['/admin/users']);
      },
      error: () => {
        this.successMessage = null;
        this.errorMessage = 'Erreur lors de l’inscription.';
      }
    });

    // Log des données envoyées
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  }
}
