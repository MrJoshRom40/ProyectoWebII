import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { CarritoService } from '../../services/Carrito/carrito.service';
import { Producto } from '../../interfaces/product.interface';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-carrito',
  standalone: true,
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  imports: [CommonModule, PaypalButtonComponent], // Asegúrate de que CommonModule esté aquí
})
export class CarritoComponent implements OnInit{
  productos: Producto[] = [];
  total: number = 0;

  constructor(private carritoService: CarritoService) {
    this.productos = carritoService.getItems();
    this.total = carritoService.getTotal();
  }

  ngOnInit(): void {
    this.mostrarAlerta();
    this.iniciar();
  }

  vaciarCarrito(){
    this.productos = [];
    this.carritoService.clearCart();
    this.total = 0;
  }

  iniciar(): void{
    this.productos = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
    console.log(this.carritoService.getItems());
  }
  // Método para eliminar un producto del carrito
  removeFromCart(idProducto: number): void {
    this.carritoService.eliminarProducto(idProducto);
    this.productos = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
  }

  // Método para aumentar la cantidad de un producto
  aumentarCantidad(idProducto: number): void {
    this.carritoService.aumentarCantidad(idProducto);
    this.productos = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
  }

  // Método para disminuir la cantidad de un producto
  disminuirCantidad(idProducto: number): void {
    this.carritoService.disminuirCantidad(idProducto);
    this.productos = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
  }

  mostrarAlerta(): void {
    Swal.fire({
      title: 'Advertencia',
      text: 'Antes de realizar tu pedido, asegurate de que sea correcto \n No nos hacemos responsables de que mal entendidos futuros',
      icon: 'warning', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'Estoy informado'
    });
  }

}
