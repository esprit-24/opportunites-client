import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:9090/api/register-candidat';

  constructor(
    private http: HttpClient
  ) { }
  
  register(candidat: FormData): Observable<any> {
    return this.http.post(this.apiUrl, candidat);
  }

}
