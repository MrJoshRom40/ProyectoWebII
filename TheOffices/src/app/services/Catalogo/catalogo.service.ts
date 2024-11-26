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

  obtenerProductoPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  actualizarProducto(producto: Producto): Observable<void> {
    console.log('Datos enviados al backend:', producto);
    return this.http.put<void>(`${this.apiUrl}/${producto.ID_Producto}`, producto);
  }
  
  agregarProducto(producto: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, producto);
  }

  eliminarProducto(idProducto: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/productos/${idProducto}`);
  }
  
  
}

