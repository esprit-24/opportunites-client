import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departement } from '../models/departement.model';

export interface Ville {
  id: number;
  nom: string;
  departement?: Departement; // Optional to allow for cases where the departement might not be provided
}

@Injectable({
  providedIn: 'root'
})


export class VilleService {

  private baseUrl = 'http://localhost:9090/api/ville';

  constructor(private http: HttpClient) { }

  getVilles(): Observable<Ville[]> {
    return this.http.get<Ville[]>(this.baseUrl);
  }


}
