import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Domaine } from '../models/domaine.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DomaineService {

  // URL de l'API pour les domaines
  private apiUrl = 'http://localhost:9090/api/domaines';

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

  // Récupérer tous les domaines
  getAllDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(`${this.apiUrl}`);
  }

  // Récupérer un domaine par son id
  getDomaineById(id: number): Observable<Domaine> {
    return this.http.get<Domaine>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau domaine
  addDomaine(domaine: Omit<Domaine, 'id'>): Observable<Domaine> {
    return this.http.post<Domaine>(`${this.apiUrl}`, domaine, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour un domaine existant
  updateDomaine(id: number, domaine: Domaine): Observable<Domaine> {
    return this.http.put<Domaine>(`${this.apiUrl}/${id}`, domaine, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer un domaine
  deleteDomaine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Rechercher des domaines par mot-clé
  searchDomaines(term: string): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(`${this.apiUrl}?search=${term}`);
  }

  // Compter le nombre de domaines
  countDomaines(term?: string): Observable<number> {
    const url = term ? `${this.apiUrl}/count?search=${term}` : `${this.apiUrl}/count`;
    return this.http.get<number>(url, {
      headers: this.getAuthHeaders()
    });
  }
  
}
