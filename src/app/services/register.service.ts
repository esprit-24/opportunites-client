import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:9090/api/register';

  constructor(
    private http: HttpClient
  ) { }
  
  register(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

}
