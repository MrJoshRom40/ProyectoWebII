import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoSelled } from '../../interfaces/product-selled.interface';

@Injectable({
  providedIn: 'root',
})
export class DetallesPedidosService {
  private apiUrl = 'http://localhost:3000/api/detalles';

  constructor(private http: HttpClient) {}

  getPedidosRealizados(pedidoId: number): Observable<any> {
    console.log('Enviando pedidoId:', pedidoId); // Depuración
    return this.http.post('http://localhost:3000/api/detalles', { pedidoId });
  }
}

