import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profil } from '../models/profil.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilsService {
  updateProfil(profil: any) {
    throw new Error('Method not implemented.');
  }
  getProfil(): any {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:9090/api/profils';

  constructor(
    private http: HttpClient
  ) { }

  // Récupérer tous les profils
  getAllProfils(): Observable<Profil[]> {
    return this.http.get<Profil[]>(`${this.apiUrl}`);
  }
}
