import { Injectable } from '@angular/core';

const API_URL = 'http://localhost:9090/api/recruteurs'; // Vérifie le port exact de ton backend


@Injectable({
  providedIn: 'root'
})
export class RecruteurService {

  constructor() { }
}
