import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Region } from '../models/region.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  // URL de l'API pour les régions
  private apiUrl = 'http://localhost:9090/api/regions';

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

  // Récupérer toutes les régions
  getAllRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}`);
  }

  // Récupérer une région par son id
  getRegionById(id: number): Observable<Region> {
    return this.http.get<Region>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle région
  addRegion(region: Omit<Region, 'id'>): Observable<Region> {
    return this.http.post<Region>(`${this.apiUrl}`, region, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour une région existante
  updateRegion(id: number, region: Region): Observable<Region> {
    return this.http.put<Region>(`${this.apiUrl}/${id}`, region, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer une région
  deleteRegion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
}
