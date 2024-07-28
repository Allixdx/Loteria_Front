import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  private socketSubscription: Subscription = new Subscription();
  private userData: any;

  constructor(
    private fb: FormBuilder,
    private loteriaService: LoteriaService,
    private socketService: SocketService,
    private router: Router
  ) {
    this.crearSalaForm = this.fb.group({});
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

          this.subscribeToSocketEvents();
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
    this.socketSubscription.unsubscribe();
    // No desconectar el socket aquí, ya que la sala debe permanecer abierta.
  }

  private subscribeToSocketEvents(): void {
    this.socketSubscription.add(
      this.socketService.onActualizarJugadores().subscribe((players: Player[]) => {
        this.jugadores = players;
        console.log('Jugadores actualizados:', this.jugadores);
      })
    );

    this.socketSubscription.add(
      this.socketService.onPartidaIniciada().subscribe((data: any) => {
        console.log('Partida iniciada:', data);
        this.router.navigate(['/playing/main', this.roomId]);
      })
    );

    this.socketSubscription.add(
      this.socketService.onPartidaTerminada().subscribe((data: any) => {
        console.log('Partida terminada:', data);
        // Lógica adicional para manejar el fin de la partida
      })
    );
  }

  crearSala(): void {
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

  iniciarPartida(): void {
    if (this.roomId) {
      this.socketService.emitIniciarPartida(this.roomId);
    } else {
      console.error('ID de sala no válido.');
    }
  }

  cerrarSala(): void {
    if (this.roomId) {
      this.loteriaService.closeRoom(this.roomId).subscribe({
        next: (response) => {
          console.log('Sala cerrada:', response);
          this.socketService.emitSalaCerrada({ roomId: this.roomId });
          this.router.navigate(['/dashboard']); // Redirige a la página del dashboard
        },
        error: (error) => {
          console.error('Error al cerrar la sala:', error);
        }
      });
    } else {
      console.error('No hay ID de sala válido para cerrar.');
    }
  }

  terminarPartida(): void {
    if (this.roomId) {
      this.socketService.emitTerminarPartida(this.roomId);
    } else {
      console.error('ID de sala no válido.');
    }
  }
}
