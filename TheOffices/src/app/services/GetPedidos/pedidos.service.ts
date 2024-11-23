import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedidos } from '../../interfaces/pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'http://localhost:3000/api/pedidos'; // URL de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener los pedidos del usuario
  getPedidosRealizados(user: number): Observable<Pedidos[]> {
    const body = { user }; // Enviar el ID del usuario en el cuerpo de la solicitud
    return this.http.post<Pedidos[]>(this.apiUrl, body); // Cambiado a POST
  }
}
