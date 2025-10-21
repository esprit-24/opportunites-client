import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departement } from '../models/departement.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  // URL de l'API pour les départements
  private apiUrl = 'http://localhost:9090/api/departements';

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

  // Récupérer tous les départements
  getAllDepartements(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}`);
  }

  // Récupérer un département par son id
  getDepartementById(id: number): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau département
  addDepartement(departement: any): Observable<Departement> {
    return this.http.post<Departement>(`${this.apiUrl}`, departement, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour un département existant
  updateDepartement(id: number, departement: Departement): Observable<Departement> {
    return this.http.put<Departement>(`${this.apiUrl}/${id}`, departement, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer un département
  deleteDepartement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
}
