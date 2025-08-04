import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Domaine } from '../models/domaine.model';

@Injectable({
  providedIn: 'root'
})
export class DomaineService {

  private apiUrl = 'http://localhost:9090/api/domaines';

  constructor(private http: HttpClient) { }

  getAllDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(this.apiUrl);
  }
}
