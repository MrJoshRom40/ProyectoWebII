import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user.interface';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/api/login'; // La URL de tu API Node.js

  login(username: string, password: string): Observable<User> {
    const loginData = { username, password }; // Datos de login
    // Hacer la petición POST a la API
    return this.http.post<User>(this.apiUrl, loginData);
  }
}
