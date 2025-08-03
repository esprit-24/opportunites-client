import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TypeContrat } from '../models/enums.model';
import { Opportunite } from '../models/opportunite.model';

export interface SearchFilters {
  domaine?: string;
  typeContrat: TypeContrat;
  ville?: string;
  salaireMin?: number;
}

@Injectable({
  providedIn: 'root'
})

export class JobService {
  
  private readonly API_BASE_URL = 'http://localhost:9090/api'; // Remplacez par votre URL d'API
  
  constructor(private http: HttpClient) {}

  searchOpportunites(filters: SearchFilters): Observable<Opportunite[]> {
    let params = new HttpParams();
    
    if (filters.domaine) {
      params = params.set('domaine', filters.domaine);
    }
    if (filters.typeContrat) {
      params = params.set('typeContrat', filters.typeContrat);
    }
    if (filters.ville) {
      params = params.set('ville', filters.ville);
    }
    if (filters.salaireMin) {
      params = params.set('salaireMin', filters.salaireMin.toString());
    }
  

    return this.http.get<Opportunite[]>(`${this.API_BASE_URL}/opportunites/search`, { params });
  }
}