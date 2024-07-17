import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';

interface Player {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.scss']
})
export class CrearSalaComponent implements OnInit, OnDestroy {
  crearSalaForm: FormGroup;
  codigoSala: string | null = null;
  jugadores: Player[] = [];
  private jugadorUnidoSubscription: Subscription;

  constructor(
    private fb: FormBuilder, 
    private loteriaService: LoteriaService,
    private socketService: SocketService
  ) {
    this.crearSalaForm = this.fb.group({});
    this.jugadorUnidoSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.codigoSala = this.loteriaService.getCodigoSala();
    if (this.codigoSala) {
      console.log(`Código de sala recibido: ${this.codigoSala}`);
    } else {
      console.log('No se recibió código de sala.');
    }
    this.socketService.connect();
      this.jugadorUnidoSubscription = this.socketService.onJugadorUnido().subscribe((data: any) => {
        this.jugadores.push(data);
        console.log('Jugador unido:', data);
      });
  }

  ngOnDestroy(): void {
    this.jugadorUnidoSubscription.unsubscribe();
    this.socketService.disconnect();
  }

  iniciarPartida() {
    // Lógica para iniciar la partida
  }

  cerrarSala() {
    // Lógica para cerrar la sala
  }
}
