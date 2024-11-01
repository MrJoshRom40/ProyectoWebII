// catalogo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../interfaces/product.interface';



@Injectable({
  providedIn: 'root'
})

export class CatalogoService {
  private apiUrl = 'http://localhost:3000/api/productos'; // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}

