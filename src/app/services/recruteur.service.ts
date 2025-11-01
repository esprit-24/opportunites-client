import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Recruteur } from "../models/recruteur.model";
import { OpportuniteService } from "./opportunite.service";
@Injectable({
  providedIn: "root",
})
export class RecruteurService {
  // URL de base
  private apiUrl = "http://localhost:9090/api/recruteurs";  
    constructor(    private http: HttpClient,
    private authService: AuthService
  ) {}

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
    // Récupérer tous les recruteurs    
    getAllRecruteurs(): Observable<Recruteur[]> {
    return this.http.get<Recruteur[]>(`${this.apiUrl}`);
    }
    // Récupérer un recruteur par son id
    getRecruteurById(id: number): Observable<Recruteur> {
    return this.http.get<Recruteur>(`${this.apiUrl}/${id}`);
    }
    // Créer un nouveau recruteur
    addRecruteur(recruteur: any): Observable<Recruteur> {
    return this.http.post<Recruteur>(`${this.apiUrl}`, recruteur);
    }
    // Mettre à jour un recruteur existant
    updateRecruteur(id: number, recruteur: Recruteur): Observable<Recruteur> {
    return this.http.put<Recruteur>(`${this.apiUrl}/${id}`, recruteur);
    }
    // Supprimer un recruteur
    deleteRecruteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Récupérer un recruteur par son id utilisateur
    getRecruteurByUserId(userId: number): Observable<Recruteur> {
      return this.http.get<Recruteur>(`${this.apiUrl}/user/${userId}`);
    }

    // Récupérer l'id de l'organisation d'un recruteur connecté
    getOrganisationIdByRecruteurId(recruteurId: number): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/${recruteurId}/organisation-id`);
    }

    // Récupérer l'organisation d'un recruteur connecté via son id utilisateur
  getOrganisationIdByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/organisation-id`);
  }

  // Dans RecruteurService
getUserIdConnecte(): number | null {
  return this.authService.getUserId();
}


}