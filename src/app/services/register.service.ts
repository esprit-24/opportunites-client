import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:9090/api';

  constructor(
    private http: HttpClient, private authService: AuthService
  ) { }

  // Méthode pour obtenir les headers d'authentification
  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  
  // Inscription d'un candidat
  registerCandidat(candidat: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-candidat`, candidat);
  }

  // Inscription d'un recruteur
  registerRecruteur(recruteur: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-recruteur`, recruteur, {
      headers: this.getAuthHeaders()
    })
  }

}
