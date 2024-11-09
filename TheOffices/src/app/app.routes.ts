import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'Login'},
    {path: 'Catálogo', loadComponent:() => import('./components/product-catalog/product-catalog.component').then((m) => m.ProductCatalogComponent),},
    {path: 'Login', loadComponent:() => import('./components/login/login.component').then((m) => m.LoginComponent),},
    {path: 'addUsr', loadComponent:() => import('./components/add-user/add-user.component').then((m) => m.AddUserComponent),},
    {path: 'Carrito', loadComponent:() => import('./components/carrito/carrito.component').then((m) => m.CarritoComponent),},
    {path: 'Contacto', loadComponent: () => import('./components/contacto/contacto.component').then((m) => m.ContactoComponent),},
    {path: 'Pedidos', loadComponent: () => import('./components/pedidos/pedidos.component').then((m) => m.PedidosComponent),}
];
