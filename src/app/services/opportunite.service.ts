import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Opportunite } from '../models/opportunite.model';

@Injectable({
  providedIn: 'root'
})
export class OpportuniteService {

  // URL de base
  private apiUrl = 'http://localhost:9090/api/opportunites';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

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

  // Récupérer toutes les opportunités
  getAllOpportunites(): Observable<Opportunite[]> {
    return this.http.get<Opportunite[]>(`${this.apiUrl}`);
  }

  // Récupérer une opportunité par son id
  getOpportuniteById(id: number): Observable<Opportunite> {
    return this.http.get<Opportunite>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle Opportunité
  addOpportunite(opportunite: any): Observable<Opportunite> {
    return this.http.post<Opportunite>(`${this.apiUrl}`, opportunite, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour une Opportunité existante
  updateOpportunite(id: number, opportunite: Opportunite): Observable<Opportunite> {
    return this.http.put<Opportunite>(`${this.apiUrl}/${id}`, opportunite, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer une Opportunité
  deleteOpportunite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  // Récupérer les opportunités par organisation
  getOpportunitesByOrganisation(organisationId: number) {
  return this.http.get<Opportunite[]>(`http://localhost:9090/api/opportunites/organisation/${organisationId}`);
}

}
