import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.scss']
})
export class CrearSalaComponent implements OnInit {
  crearSalaForm: FormGroup;
  codigoSala: string | null = null;
  jugadores: string[] = []; // Lista de jugadores que se unen

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.crearSalaForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.crearSala();
  }

  crearSala(): void {
    this.http.post('/api/rooms', {}).subscribe((response: any) => {
      this.codigoSala = response.codigo;
    });
  }

  iniciarPartida(): void {
    // Lógica para iniciar la partida
  }

  cerrarSala(): void {
    // Lógica para cerrar la sala
  }

  unirJugador(nuevoJugador: string): void {
    this.jugadores.push(nuevoJugador);
  }
}
