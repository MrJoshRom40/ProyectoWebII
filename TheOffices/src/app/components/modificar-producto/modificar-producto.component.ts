import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogoService } from '../../services/Catalogo/catalogo.service';
import { Producto } from '../../interfaces/product.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modificar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css'], // Arreglé el typo: styleUrl -> styleUrls
})
export class ModificarProductoComponent implements OnInit {
  producto = {
    Nombre: '',
    Descripcion: '',
    Precio: 0,
    Cantidad: 0
  };
  productos: Producto | null = null; // Producto que se va a modificar
  idProducto: string = ''; // ID del producto que se extraerá de la URL

  constructor(
    private route: ActivatedRoute,
    private catalogoService: CatalogoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this.idProducto = this.route.snapshot.paramMap.get('id') || '';
    this.cargarProducto();
  }

  cargarProducto(): void {
    // Llamar al servicio para obtener los datos del producto
    this.catalogoService.obtenerProductoPorId(this.idProducto).subscribe(
      (data: Producto) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar el producto:', error);
        Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        this.router.navigate(['/Catálogo']); // Redirige al catálogo en caso de error
      }
    );
  }

  guardarCambios(): void {
    if (this.productos) {
      this.catalogoService.actualizarProducto(this.productos).subscribe(
        () => {
          Swal.fire('Éxito', 'Producto modificado correctamente', 'success').then(() => {
            this.router.navigate(['/Catálogo']); // Redirige al catálogo tras guardar
          });
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
          Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
        }
      );
    }
  }

  cancelar(): void {
    this.router.navigate(['/Catálogo']); // Redirige al catálogo si se cancela la edición
  }
}
