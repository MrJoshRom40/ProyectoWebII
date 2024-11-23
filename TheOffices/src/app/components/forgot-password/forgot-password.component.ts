import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth P1/auth.service';
import { SendEmailService } from '../../services/Email/send-email.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // Importar FormsModule
import { NOMEM } from 'dns';
import { response } from 'express';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  username: string = '';
  pregunta: string = '';  // Almacenará la pregunta recuperada del servidor
  respuesta: string = ''; // Almacenará la respuesta del usuario
  mostrarPregunta: boolean = false;  // Controla si mostrar el segundo formulario

  constructor(private authService: AuthService, private emailService: SendEmailService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const username = form.value.username;  // Obtener el username desde el formulario
      this.username = username;
      // Llamar al servicio AuthService con el username
      this.authService.check_usr(username).subscribe(
        response => {
          console.log('Pregunta recibida:', response.pregunta);
          this.pregunta = response.pregunta;  // Asignar la pregunta al componente
          this.mostrarPregunta = true;  // Mostrar el segundo formulario
        },
        error => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }

  // Método para enviar la respuesta
  onAnswerSubmit(form: NgForm) {
    if (form.valid) {
      const respuesta = form.value.respuesta;
      this.respuesta = respuesta;
      this.emailService.sendAnswer(this.username, this.respuesta).subscribe(
        response => {
          alert('Correo enviado correctamente');
        },
        error => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }
}
