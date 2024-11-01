import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../services/Catalogo/catalogo.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/Carrito/carrito.service';
import { Producto } from '../../interfaces/product.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule], // Importa HttpClientModule aquí también
})
export class ProductCatalogComponent implements OnInit {
  productos: Producto[] = []; // Cambié 'any[]' a 'Producto[]' para mejor tipado

  constructor(private catalogoService: CatalogoService, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.cargarProductos(); // Llamar al método para cargar productos en la inicialización
  }

  cargarProductos(): void {
    this.catalogoService.obtenerProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Método para agregar un producto al carrito
  // product-catalog.component.ts
addToCart(producto: Producto): void{
  this.carritoService.addToCart(producto);
  console.log(this.carritoService.getItems());
  this.mostrarAlerta();
}


  mostrarAlerta(): void {
    Swal.fire({
      title: 'TheOffices',
      text: '¡El producto se agregó correctamente al carrito!',
      icon: 'success', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'Aceptar'
    });
  }
}
