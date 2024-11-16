import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/insert-usr';

  constructor(private http: HttpClient) { }

  check_usr(username: string): Observable<any>{
    const usr = {username};
    return this.http.post<any>(this.apiUrl, usr);
  }
}
