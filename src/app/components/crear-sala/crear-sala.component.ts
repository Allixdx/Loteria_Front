import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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

export class CrearSalaComponent implements OnInit, OnDestroy, AfterViewInit {
  crearSalaForm: FormGroup;
  codigoSala: string | null = null;
  roomId: number | null = null;
  jugadores: Player[] = [];
  private actualizarPlayers: Subscription;
  private userData: any;

  constructor(
    private fb: FormBuilder,
    private loteriaService: LoteriaService,
    private socketService: SocketService
  ) {
    this.crearSalaForm = this.fb.group({});
    this.actualizarPlayers = new Subscription();
  }

  ngOnInit(): void {
    this.crearSala();
  }

  ngAfterViewInit(): void {
    if (this.codigoSala && this.roomId) {
      this.loteriaService.getUser().subscribe({
        next: (response) => {
          this.userData = {
            room: this.roomId,
            userId: response.user.id,
            name: response.user.name,
            email: response.user.email,
          };
          console.log(this.userData);

          this.socketService.connect();
          this.socketService.emitJugadorUnido(this.userData);

          // Suscribirse para recibir actualizaciones de jugadores
          this.actualizarPlayers = this.socketService.onActualizarJugadores().subscribe((players: Player[]) => {
            this.jugadores = players;
            console.log('Jugadores actualizados:', this.jugadores);
          });
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
        }
      });
    } else {
      console.log('No se recibió código de sala o ID de sala.');
    }
  }

  ngOnDestroy(): void {
    this.actualizarPlayers.unsubscribe();
    this.socketService.disconnect();
  }

  crearSala() {
    this.loteriaService.createRoom().subscribe({
      next: (data) => {
        console.log(data);
        this.codigoSala = data.codigoSala;
        this.roomId = data.roomId;
        console.log(`Sala creada con el código: ${this.codigoSala} y ID: ${this.roomId}`);
        this.ngAfterViewInit();
      },
      error: (error) => {
        console.error('Error al crear la sala', error);
      }
    });
  }

  iniciarPartida() {
    // Lógica para iniciar la partida
  }

  cerrarSala() {
    // Lógica para cerrar la sala
  }
}
