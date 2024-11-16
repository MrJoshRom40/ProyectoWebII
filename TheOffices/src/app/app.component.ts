import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { LoginComponent } from './components/login/login.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PaypalButtonComponent } from './components/paypal-button/paypal-button.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductCatalogComponent, CommonModule, HttpClientModule, ForgotPasswordComponent, LoginComponent, AddUserComponent, CarritoComponent, RouterLink, PaypalButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Cambia styleUrl por styleUrls
})
export class AppComponent implements OnInit {
  title = 'TheOffices';
  constructor(private router: Router) {}

  ngOnInit() {
    // Redirigir a /Login en la inicializació
    this.router.navigate(['/Login']);
  }

  isLoginRoute(): boolean {
    if(this.router.url === '/Login' || this.router.url === '/addUsr' || this.router.url === '/Recuperar')
      return true;
    return false;
  }
}

