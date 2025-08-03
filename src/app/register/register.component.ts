import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: [''],
      lastName: ['']
    }, { validator: this.passwordsMatchValidator });
    
  }

  private passwordsMatchValidator(form: FormGroup) {

    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };

  }


  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { confirmPassword, ...data } = this.registerForm.value;

    const user = {
      ...data,
      langKey: 'fr'
    };

    this.registerService.register(user).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie. En attente d’activation.';
        this.errorMessage = null;
        this.registerForm.reset();
        this.router.navigate(['/']);
      },
      error: () => {
        this.successMessage = null;
        this.errorMessage = 'Erreur lors de l’inscription.';
      }
    });
  }

}
