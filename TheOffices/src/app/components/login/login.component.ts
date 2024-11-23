import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/Login/login.service'; // Importa tu servicio de autenticación
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/User/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  user: User | null = null; // Para almacenar la respuesta del usuario




  constructor(private loginService: LoginService, private router: Router, private us: UserService) {}

  // Método que se ejecuta cuando el usuario envía el formulario
  onLogin() {
    this.loginService.login(this.username, this.password).subscribe(
      (response: User) => {
        this.user = response;
        console.log('Login exitoso', this.user);
        this.us.setUser(this.user);
        this.router.navigate(['/Catálogo'])

        this.mnsg();
      },
      (error) => {
        console.error('Error en el login', error);
        this.diff();
      }
    );
  }

  mnsg() {
    Swal.fire({
      title: 'TheOffices',
      text: 'Bienvenido ' + this.user?.Usuario,
      icon: 'success', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'Aceptar'
    });
  }

  diff() {
    Swal.fire({
      title: 'TheOffices',
      text: 'Usuario o contraseña incorrectos',
      icon: 'error', // Puedes usar 'warning', 'error', 'info', 'success', 'question'
      confirmButtonText: 'Aceptar'
    });
  }

  register(){
    this.router.navigate(['/addUsr'])
  }

  recuperate(){
    this.router.navigate(['/Recuperar'])
  }
}

