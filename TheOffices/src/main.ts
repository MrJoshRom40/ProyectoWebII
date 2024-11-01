import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; // Importa las rutas definidas
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proveer enrutamiento
    provideHttpClient(),   // Proveer HttpClient para servicios como AuthService
  ]
}).catch((err) => console.error(err));

