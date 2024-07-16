import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.scss']
})
export class CrearSalaComponent implements OnInit {
  codigoSala: string = '';
  jugadores: string[] = []; // Aquí almacenarás los jugadores

  constructor(private loteriaService: LoteriaService, private router: Router) {}

  ngOnInit(): void {
    this.crearSala();
  }

  crearSala(): void {
    this.loteriaService.createRoom().subscribe(response => {
      this.codigoSala = response;
    });
  }

  iniciarPartida(): void {
    // Lógica para iniciar la partida (puedes hacer una llamada a la API si es necesario)
    console.log('Partida iniciada');
  }

  cerrarSala(): void {
    // Lógica para cerrar la sala (puedes hacer una llamada a la API si es necesario)
    console.log('Sala cerrada');
  }

  agregarJugador(jugador: string): void {
    this.jugadores.push(jugador);
  }
}
