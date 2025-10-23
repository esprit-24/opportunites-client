import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ville } from '../models/ville.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VilleService {

  // URL de l'API pour les villes
  private apiUrl = 'http://localhost:9090/api/villes';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Méthode pour obtenir les headers d'authentification
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

  // Récupérer toutes les villes
  getAllVilles(): Observable<Ville[]> {
    return this.http.get<Ville[]>(`${this.apiUrl}`);
  }

  // Récupérer une ville par son id
  getVilleById(id: number): Observable<Ville> {
    return this.http.get<Ville>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle ville
  addVille(ville: any): Observable<Ville> {
    return this.http.post<Ville>(`${this.apiUrl}`, ville, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour une ville existante
  updateVille(id: number, ville: Ville): Observable<Ville> {
    return this.http.put<Ville>(`${this.apiUrl}/${id}`, ville, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer une ville
  deleteVille(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
}