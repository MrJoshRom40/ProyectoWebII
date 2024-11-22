import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  constructor(private router: Router){}

  irAPreguntasFrecuentes() {
    this.router.navigate(['/Preguntas frecuentes']);
  }

  irAAvisoTerminos() {
    this.router.navigate(['/Avisos']);
  }
}
