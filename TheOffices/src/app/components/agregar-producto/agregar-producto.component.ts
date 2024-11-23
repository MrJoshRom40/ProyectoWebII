import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogoService } from '../../services/Catalogo/catalogo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
})
export class AgregarProductoComponent {
  producto: any = {
    Nombre: '',
    Descripcion: '',
    Precio: 0,
    Cantidad: 0,
  };

  constructor(private catalogoService: CatalogoService, private router: Router) {}

  guardarProducto(): void {
    console.log('Datos del producto a guardar:', this.producto);

    this.catalogoService.agregarProducto(this.producto).subscribe(
      () => {
        Swal.fire('Éxito', 'Producto agregado correctamente', 'success').then(() => {
          this.router.navigate(['/Catálogo']);
        });
      },
      (error) => {
        console.error('Error al agregar el producto:', error);
        Swal.fire('Error', 'No se pudo agregar el producto', 'error');
      }
    );
  }

  cancelar(): void {
    this.router.navigate(['/Catálogo']);
  }
}
