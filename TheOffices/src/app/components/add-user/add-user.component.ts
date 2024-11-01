import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AddUserService } from '../../services/addUser/add-user.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule aquí
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  username: string = '';
  password: string = '';
  correo: string = '';
  pregunta: string = '';
  respuesta: string = '';
  direccion: string = '';
  message: string = '';
  
  constructor(private addUser: AddUserService, private router: Router) {}

  onSubmit() {

    Swal.fire({
      title: '¿Estás segur@ de que es correcta tu dirección?',
      text: 'No nos hacemos responsables si tu realizas un pedido\ny este no llega por la dirección erronea',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario acepta, procede con el registro
        this.addUser.addUser(this.username, this.password, this.correo, this.pregunta, this.respuesta, this.direccion)
          .subscribe(
            (response) => {
              console.log('Response:', response);
              this.clearForm();
              this.message = response.message || 'Usuario registrado con éxito';
              this.mnsg();
              this.router.navigate(['/Login']);
            },
            (error) => {
              console.error('Error:', error);
              this.message = 'Error al registrar el usuario: ' + (error.error?.error || error.message);
            }
          );
      } else {
        // Si el usuario cancela, no se hace nada
        console.log('Registro cancelado');
      }
    });
  }
  
  mnsg() {
    Swal.fire({
      title: 'TheOffices',
      text: 'Usuario añadido\ncorrectamente',
      icon: 'success', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'Ok'
    });
  }

  empty(str: string): boolean{
    return str === "";
  }

  msg(){
    Swal.fire({
      title: 'TheOffices',
      text: 'Debes de ingresar todos los campos',
      icon: 'error', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'Aceptar'
    });
  }

  clearForm() {
    this.username = '';
    this.password = '';
    this.correo = '';
    this.pregunta = '';
    this.respuesta = '';
    this.direccion = '';
  }


}
