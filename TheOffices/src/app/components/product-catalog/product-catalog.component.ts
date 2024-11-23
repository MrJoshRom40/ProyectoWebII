import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../../services/Catalogo/catalogo.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/Carrito/carrito.service';
import { Producto } from '../../interfaces/product.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class ProductCatalogComponent implements OnInit {
  productos: Producto[] = [];
  esAdmin: boolean = false; // Indica si el usuario es administrador

  constructor(
    private router: Router,
    private catalogoService: CatalogoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.verificarRolUsuario(); 
    this.cargarProductos();
  }

  verificarRolUsuario(): void {
    const usuarioActual = localStorage.getItem('rol'); 
    this.esAdmin = usuarioActual === '1'; // 1 = admin, 0 = usuario
  }

  cargarProductos(): void {
    this.catalogoService.obtenerProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los productos. Por favor, inténtalo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

  agregarProducto(): void {
    this.router.navigate(['Agregar']); // Redirige a la página de agregar producto
  }
  

  modificarProducto(producto: Producto): void {
    this.router.navigate(['Producto', producto.ID_Producto]);
  }

  addToCart(producto: Producto): void {
    this.carritoService.addToCart(producto);
    console.log(this.carritoService.getItems());
    this.mostrarAlerta();
  }

  mostrarAlerta(): void {
    Swal.fire({
      title: 'TheOffices',
      text: '¡El producto se agregó correctamente al carrito!',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }
}
