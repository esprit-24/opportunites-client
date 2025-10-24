import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

export interface AdminStats {
  totalUsers: number;
  totalCandidats: number;
  totalRecruteurs: number;
  totalOpportunites: number;
  opportunitesActives: number;
  opportunitesExpirees: number;
  totalCandidatures: number;
  candidaturesEnAttente: number;
  candidaturesValidees: number;
  organisationsActives: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly apiUrl = 'http://localhost:9090/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ***********************************************************************************************
  // Gestion des utilisateurs
  // ***********************************************************************************************

  getCurrentAccount(): Observable<any> {
    return this.http.get<any>('http://localhost:9090/api/account', {
      headers: this.getAuthHeaders()
    });
  }
  

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  // Récupérer un utilisateur par son login
  getUserByLogin(login: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${login}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour un utilisateur
  updateUser(user: User): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${user.login}`, user, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer un utilisateur
  deleteUser(user: User): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/users/${user.login}`, {
      headers: this.getAuthHeaders()
    });
  }

}
