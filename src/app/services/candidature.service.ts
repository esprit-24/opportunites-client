import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidature } from '../models/candidature.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  private apiUrl = 'http://localhost:9090/api/candidatures';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // Récupérer toutes les candidatures
  getAllCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Récupérer une candidature par ID
  getCandidaturesByCandidat(id: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/candidat/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Ajouter une nouvelle candidature
  addCandidature(candidature: any): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, candidature, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour une candidature
  updateCandidature(id: number, candidature: Candidature): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.apiUrl}/${id}`, candidature, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer une candidature
  deleteCandidature(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
