import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User | null = null; // Aquí puedes definir el tipo de datos del usuario

  constructor() { }

  // Método para establecer el usuario
  setUser(user: User): void {
    this.user = user;
  }

  // Método para obtener el usuario
  getUser(): User | null {
    return this.user;
  }

  // Método para saber si el usuario está logueado
  isLoggedIn(): boolean {
    return this.user !== null;
  }

  // Método para eliminar el usuario (cerrar sesión)
  clearUser(): void {
    this.user = null;
  }

  getUserName(){
    return this.user?.Usuario;
  }

  getUserID(){
    return this.user?.ID_Usuario;
  }
}
