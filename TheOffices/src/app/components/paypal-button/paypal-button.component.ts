import { Component, AfterViewInit, Input } from '@angular/core';
import { CarritoComponent } from '../carrito/carrito.component';
import Swal from 'sweetalert2';
import { UserService } from '../../services/User/user.service';
import { PedidoService } from '../../services/Pedido/pedido.service';
import { Pedido } from '../../interfaces/pedido.interface';
import { DetallesService } from '../../services/Detalles/detalles.service';
import { response } from 'express';



declare var paypal: any; // Declarar la variable paypal

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  imports: [],
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css'] // Corregido a styleUrls
})
export class PaypalButtonComponent implements AfterViewInit {
  @Input() total: number = 0; // Recibir el total como entrada
  @Input() productos: any[] = []; // Recibir la lista de productos como entrada

  constructor(private carritoC: CarritoComponent, private us: UserService, private ps: PedidoService, private ds: DetallesService){
    
  }
  

  ngAfterViewInit(): void {
    this.renderPaypalButton();
    this.total = this.total * 1.16;
  }

  renderPaypalButton(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toString(), // Convertir el total a string
            },
          }],
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.mostrarAlerta(details.payer.name.given_name);
          this.crearPedido(); // Llama al método para crear el pedido
          this.crearDetalles();
          this.generarArchivoXML(details.payer.name.given_name);
          this.vaciarCarrito();
        });
      },
      onError: (err: any) => {
        console.error(err);
        alert('Error en el proceso de pago. Intenta nuevamente.');
      },
    }).render('#paypal-button-container'); // Renderiza el botón en el contenedor
  }

  crearDetalles(): void{
    const userId = this.us.getUserID(); // Asegúrate de que este método devuelva un ID válido
    if (userId === undefined) {
      console.error('El ID de usuario no está definido.');
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    this.productos.forEach(producto => {    
      this.ds.addDetalles(userId, this.total, producto.ID_Producto, producto.Cantidad, producto.Cantidad * producto.Precio).subscribe({
        next: response => {
          console.log("Detalles añadidos correctamente:", response);
        },
        error: error => {
          console.error('Error al añadir detalles:', error);
        }
      });
    });
  }

  crearPedido(): void {
    const userId = this.us.getUserID(); // Asegúrate de que este método devuelva un ID válido
    if (userId === undefined) {
      console.error('El ID de usuario no está definido.');
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const nuevoPedido: Pedido = {
      total: this.total,
      user: userId, // Aquí usas el ID del usuario
    };

    this.ps.addPedido(nuevoPedido).subscribe({
      next: (response) => {
        console.log('Pedido creado con éxito:', response);
        Swal.fire({
          title: 'Éxito',
          text: 'El pedido ha sido creado correctamente.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el pedido. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  generarArchivoXML(nombreCliente: string): void {
    const xmlString = this.crearXML(nombreCliente);
    this.descargarXML(xmlString, 'pedido.xml');
  }

  crearXML(nombreCliente: string): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<pedido>\n`;
    xml += `  <CuantaPago>${nombreCliente}</CuantaPago>\n`;
    xml += `  <Usuario>${this.us.getUserName()}</Usuario>\n`;
    xml += `  <fecha>${new Date().toISOString().slice(0, 10)}</fecha>\n`;
    xml += `  <productos>\n`;

    this.productos.forEach(producto => {
      xml += `    <producto>\n`;
      xml += `      <nombre>${producto.Nombre}</nombre>\n`;
      xml += `      <cantidad>${producto.Cantidad}</cantidad>\n`;
      xml += `      <precio>${producto.Precio}</precio>\n`;
      xml += `    </producto>\n`;
    });

    xml += `  </productos>\n`;
    xml += `  <total>${this.total}</total>\n`;
    xml += `</pedido>`;

    return xml;
  }

  descargarXML(xmlString: string, filename: string): void {
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  mostrarAlerta(detail: any): void {
    Swal.fire({
      title: 'TheOffices',
      text: 'Se ha realizado la compra correctamente por: ' + detail,
      icon: 'success', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'ok'
    });
  }

  vaciarCarrito(){
    this.carritoC.vaciarCarrito();
  }
}
