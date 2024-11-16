import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {
  private apiUrl = 'http://localhost:3000/api/check-answer'; // URL de tu API

  constructor(private http: HttpClient) { }

  // Método para enviar la respuesta de seguridad y recibir el correo con los datos
  sendAnswer(username: string, respuesta: string): Observable<any> {
    const body = { username, respuesta };
    return this.http.post<any>(this.apiUrl, body);
  }
}
