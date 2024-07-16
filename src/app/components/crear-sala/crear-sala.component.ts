import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { SocketService } from 'src/app/service/socket.service';


@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.scss']
})
export class CrearSalaComponent implements OnInit {

  crearSalaForm: FormGroup;
  codigoSala: string | null = null;
  jugadores: string[] = [];
  

  constructor(private fb: FormBuilder, private loteriaService: LoteriaService, private socketService: SocketService, private cdr: ChangeDetectorRef) {
    this.crearSalaForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.codigoSala = this.loteriaService.getCodigoSala();
    if (this.codigoSala) {
      console.log(`Código de sala recibido: ${this.codigoSala}`);

      // Escuchar cuando un jugador se une
      this.socketService.onPlayerJoined((data) => {
        console.log('Jugador unido recibido:', data);
        this.jugadores.push(data.user.email); // O el campo que quieras mostrar
        this.cdr.detectChanges(); // Fuerza la actualización de la vista
        console.log('Jugadores actuales:', this.jugadores);
    });
    
    
      
    } else {
      console.log('No se recibió código de sala.');
    }
  }

  iniciarPartida() {
    // Lógica para iniciar la partida
  }

  cerrarSala() {
    // Lógica para cerrar la sala
  }
}
