import { Injectable } from '@angular/core';
import { Producto } from '../../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: Producto[] = [];
    
  // Método para agregar un producto al carrito
  addToCart(producto: Producto): void {
    const existingProduct = this.items.find(item => item.ID_Producto === producto.ID_Producto);
    if (existingProduct) {
      // Si el producto ya existe en el carrito, solo incrementa la cantidad
      existingProduct.Cantidad += 1;
    } else {
      // Si el producto no existe, agrégalo con cantidad 1
      producto.Cantidad = 1;
      this.items.push(producto);
    }
  }
  
  // Método para eliminar un producto del carrito
  eliminarProducto(idProducto: number): void {
    this.items = this.items.filter((item) => item.ID_Producto !== idProducto);
  }

  aumentarCantidad(idProducto: number): void {
    const producto = this.items.find(item => item.ID_Producto === idProducto);
    if (producto) {
      producto.Cantidad += 1;
    }
  }

  // Método para disminuir la cantidad de un producto
  disminuirCantidad(idProducto: number): void {
    const producto = this.items.find(item => item.ID_Producto === idProducto);
    if (producto && producto.Cantidad > 1) {
      producto.Cantidad -= 1;
    }
  }

  // Obtener los productos del carrito
  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((total, producto) => {
        // Aquí no necesitas parseFloat, ya que Precio es un número
        return total + (producto.Precio * producto.Cantidad);
    }, 0);
}

}
