import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ville } from '../models/ville.model';


@Injectable({
  providedIn: 'root'
})


export class VilleService {

  private apiUrl = 'http://localhost:9090/api/villes';

  constructor(private http: HttpClient) { }

  getAllVilles(): Observable<Ville[]> {
    return this.http.get<Ville[]>(this.apiUrl);
  }


}
