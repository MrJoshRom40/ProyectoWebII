import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductoSelled } from '../../../interfaces/product-selled.interface';
import { Pedidos } from '../../../interfaces/pedidos.interface';
import { DetallesPedidosService } from '../../../services/DetallesPedidos/detalles-pedidos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalles-pedido',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.css'
})
export class DetallesPedidoComponent implements OnInit {
  detalles: ProductoSelled[] = [];
  pedido: Pedidos | undefined;

  constructor(private detallesService: DetallesPedidosService, private router: Router) {}

  ngOnInit(): void {
    this.pedido = history.state.data; // Datos pasados al navegar
    const pedidoId = this.pedido?.ID_Pedido;
  
    if (pedidoId !== undefined) {
      console.log('ID del pedido:', pedidoId); // Depuración
      this.cargardetalles(pedidoId); // Llama al servicio con el ID del pedido
    } else {
      console.error('Error: El ID del pedido no está definido.');
    }
  }
  
  cargardetalles(pedidoId: number): void {
    this.detallesService.getPedidosRealizados(pedidoId).subscribe(
      (data) => {
        this.detalles = data;
        console.log('Detalles cargados:', data); // Verifica los datos recibidos
      },
      (error) => {
        console.error('Error al cargar pedidos:', error); // Manejo de errores
      }
    );
  }
  
}
