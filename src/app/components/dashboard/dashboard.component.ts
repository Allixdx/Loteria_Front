import { Component } from '@angular/core';
import { LoteriaService } from 'src/app/service/loteria.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  codigoSala: string | null = null;

  constructor(private loteriaService: LoteriaService, private router: Router) {}

  crearSala() {
    this.loteriaService.createRoom().subscribe({
      next: (codigo) => {
        this.codigoSala = codigo;
        console.log(`Sala creada con el código: ${codigo}`);
        this.router.navigate(['/crearSala', { codigo: codigo }]);
      },
      error: (error) => {
        console.error('Error al crear la sala', error);
      }
    });
  }
}