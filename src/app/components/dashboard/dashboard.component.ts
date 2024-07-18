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
        this.router.navigate(['/crearSala']);
  }
}