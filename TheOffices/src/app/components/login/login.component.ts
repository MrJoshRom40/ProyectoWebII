import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/Login/login.service';
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
  styleUrls: ['./login.component.css'], // Arreglar typo: styleUrl -> styleUrls
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  user: User | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {}

  onLogin(): void {
  if (!this.username || !this.password) {
    Swal.fire('Error', 'Por favor, ingrese usuario y contraseña.', 'error');
    return;
  }

  this.loginService.login(this.username, this.password).subscribe(
    (response: User) => {
      this.user = response;
      localStorage.setItem('rol', this.user.Tipo + ""); // Guardar como string para evitar errores
      this.userService.setUser(this.user);
      this.router.navigate(['/Catálogo']);
      this.showSuccessMessage();
    },
    (error) => {
      console.error('Error en el login', error);
      this.showErrorMessage();
    }
  );
}


  private showSuccessMessage(): void {
    Swal.fire({
      title: 'TheOffices',
      text: `Bienvenido, ${this.user?.Usuario}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  private showErrorMessage(): void {
    Swal.fire({
      title: 'TheOffices',
      text: 'Usuario o contraseña incorrectos',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  register(): void {
    this.router.navigate(['/addUsr']);
  }

  recuperate(){
    this.router.navigate(['/Recuperar'])
  }
}
