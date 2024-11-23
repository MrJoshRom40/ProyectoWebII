import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesService {
  private apiUrl = 'http://localhost:3000/api/addDetalles';

  constructor(private http: HttpClient) { }

  addDetalles(usuario: number, total: number, producto: number, cantidad: number, subtotal: number): Observable<any> {
    const detalle = {usuario, total, producto, cantidad, subtotal};
    return this.http.post(this.apiUrl, detalle);
  }
}
