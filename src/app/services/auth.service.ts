import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9090/api/authenticate';

  constructor(
    private http: HttpClient
  ) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, {
      username: credentials.username,
      password: credentials.password,
      rememberMe: true
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      return [];
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const authClaim = payload.auth; // ← "auth" est le bon nom
      
      if (!authClaim) {
        return [];
      }

      return authClaim ? authClaim.split(' ').map((r: string) => r.trim()) : [];
    } catch {
      return [];
    }
  }

  getUserLogin(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
  
  
  
}
