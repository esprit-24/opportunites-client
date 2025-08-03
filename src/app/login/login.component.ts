import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  onSubmit() {
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.id_token);
        this.errorMessage = null;


        const roles = this.authService.getUserRoles();

        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else if (roles.includes('ROLE_USER')) {
          this.router.navigate(['/candidat']); // Page candidat
        } else if (roles.includes('ROLE_RECRUTEUR')) {
          this.router.navigate(['/recruteur']);
        }
      },
      error: () => {
        this.errorMessage = 'Échec de la connexion. Vérifie tes identifiants.';
      }
    });
  }

}
