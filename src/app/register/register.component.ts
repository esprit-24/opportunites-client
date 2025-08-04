import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { NiveauEtude } from '../models/enums.model';
import { Profil } from '../models/profil.model';
import { ProfilsService } from '../services/profils.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  NiveauEtude = NiveauEtude;
  niveauxEtude: string[] = [];
  profils: Profil[] = [];
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.getProfils();
  }

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private profilsService: ProfilsService,
    private router: Router
  ) {

    this.niveauxEtude = Object.values(this.NiveauEtude);

    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: [''],
      lastName: [''],
      dateNaissance: [null],
      niveauEtude: [''],
      statutActuel: [''],
      cvUrl: [''],
      profilId: [null, [Validators.required]],
    }, { validator: this.passwordsMatchValidator });
    
  }

  // Validateur personnalisé pour vérifier si les mots de passe correspondent
  private passwordsMatchValidator(form: FormGroup) {

    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };

  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier PDF pour le CV.';
      return;
    }

    const { confirmPassword, ...data } = this.registerForm.value;

    const formData = new FormData();

    // Ajout des champs en tant que chaînes
    formData.append('login', data.login);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);

    // Convertir la date de naissance en format ISO
    const dateNaissanceISO = data.dateNaissance ? new Date(data.dateNaissance).toISOString() : '';
    formData.append('dateNaissance', dateNaissanceISO);


    formData.append('niveauEtude', data.niveauEtude);
    formData.append('statutActuel', data.statutActuel);
    formData.append('profilId', Number(data.profilId).toString());

    // Ajouter le fichier CV
    formData.append('cvUrl', this.selectedFile);

    this.registerService.register(formData).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie. En attente d’activation.';
        this.errorMessage = null;
        this.registerForm.reset();
      },
      error: () => {
        this.successMessage = null;
        this.errorMessage = 'Erreur lors de l’inscription.';
      }
    });
  }

  // Récupérer les profils
  getProfils(): void {
    this.profilsService.getAllProfils().subscribe({
      next: (profils) => {
        this.profils = profils;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la récupération des profils.';
      }
    });
  }

  // Méthode pour gérer le changement de fichier
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.selectedFile = null;
      return;
    }
    const file = input.files[0];
    if (file.type === 'application/pdf') {
      this.selectedFile = file;
      this.errorMessage = null;
    } else {
      this.errorMessage = 'Veuillez sélectionner un fichier PDF valide.';
      this.selectedFile = null;
    }
  }


}
