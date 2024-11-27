import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/GetPedidos/pedidos.service';
import { Pedidos } from '../../interfaces/pedidos.interface';
import { UserService } from '../../services/User/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: Pedidos[] = [];

  constructor(private pedidosService: PedidosService, private us: UserService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.us.getUserID(); // Obtener el ID del usuario
    const userType = this.us.getuserType();
    if (userId !== undefined) {
      if(userType === 1){
        this.cargarPedidosTotales();
      } else if(userType === 0){
        this.cargarPedidos(userId);
      }
    } else {
      console.error('Error: El ID de usuario no está definido.');
    }
  }

  cargarPedidos(userId: number): void {
    this.pedidosService.getPedidosRealizados(userId).subscribe(
      (data: Pedidos[]) => {
        this.pedidos = data; // Guardar los pedidos obtenidos
        console.log('Pedidos cargados:', data);
      },
      (error) => {
        console.error('Error al cargar pedidos:', error);
      }
    );
  }

  cargarPedidosTotales(): void{
    this.pedidosService.getPedidosRealizadosTotales().subscribe(
      (data: Pedidos[]) => {
        this.pedidos = data; // Guardar los pedidos obtenidos
        console.log('Pedidos cargados:', data);
      },
      (error) => {
        console.error('Error al cargar pedidos:', error);
      }
    );
  }

  verDetalles(pedido: Pedidos) {
    this.router.navigate(['/Detalles'], { state: { data: pedido } });
  }
  
}
