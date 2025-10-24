import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Organisation } from '../models/organisation.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  // URL de base
  private apiUrl = 'http://localhost:9090/api/organisations';
  organisationService: any;

  constructor(private http: HttpClient,private authService: AuthService) { }

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

  // Récupérer toutes les organisations
  getAllOrganisations(): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(`${this.apiUrl}`);
  }

  // Récupérer une organisation par son id
  getOrganisationById(id: number): Observable<Organisation> {
    return this.http.get<Organisation>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle organisation
  addOrganisation(organisation: any): Observable<Organisation> {
    return this.http.post<Organisation>(`${this.apiUrl}`, organisation, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour une organisation existante
  updateOrganisation(id: number, organisation: Organisation): Observable<Organisation> {
    return this.http.put<Organisation>(`${this.apiUrl}/${id}`, organisation, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer une organisation
  deleteOrganisation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }


}
