import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddUserService {
  private apiUrl = 'http://localhost:3000/api/register';

  constructor(private http: HttpClient) { }

  addUser(username: string, password: string, correo: string, pregunta: string, respuesta: string, direccion: string): Observable<any>{
    const userData = {username, password, correo, pregunta, respuesta, direccion};
    return this.http.post<any>(this.apiUrl, userData);
  } 
}
