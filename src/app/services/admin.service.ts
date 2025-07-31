import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:9090/api/admin/users';

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

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user, {
      headers: this.getAuthHeaders()
    });
  }

}
