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
  styleUrls: ['./modificar-producto.component.css'],
})
export class ModificarProductoComponent implements OnInit {
  producto: Producto = {
    ID_Producto: 0, // Asegúrate de incluir este campo si lo necesitas para la actualización
    Nombre: '',
    Descripcion: '',
    Precio: 0,
    Cantidad: 0,
  };

  idProducto: string = ''; // ID del producto extraído de la URL

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
        console.log('Datos del producto cargado:', data);
        this.producto = data; // Asigna directamente el objeto obtenido al modelo
      },
      (error) => {
        console.error('Error al cargar el producto:', error);
        Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        this.router.navigate(['/Catálogo']); // Redirige al catálogo en caso de error
      }
    );
  }

  guardarCambios(): void {
    // Asegurarse de que el ID del producto esté asignado
    this.producto.ID_Producto = parseInt(this.idProducto, 10);

    console.log('Datos del producto antes de enviar:', this.producto);

    // Llamar al servicio para actualizar el producto
    this.catalogoService.actualizarProducto(this.producto).subscribe(
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

  cancelar(): void {
    this.router.navigate(['/Catálogo']); // Redirige al catálogo si se cancela la edición
  }
}
