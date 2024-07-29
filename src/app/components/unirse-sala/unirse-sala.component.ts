import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';

interface Player {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-unirse-sala',
  templateUrl: './unirse-sala.component.html',
  styleUrls: ['./unirse-sala.component.scss']
})
export class UnirseSalaComponent implements OnInit, OnDestroy {

  joinRoomForm: FormGroup;
  errorMessage: string | null = null;
  userData: any | null = null;
  unido: boolean = false;
  jugadores: Player[] = [];
  private socketSubscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, 
    private loteriaService: LoteriaService, 
    private socketService: SocketService,
    private router: Router
  ) {
    this.joinRoomForm = this.fb.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscribeToSocketEvents();
  }

  onSubmit(): void {
    if (this.joinRoomForm.valid) {
      const codigo = this.joinRoomForm.value.codigo;
      this.loteriaService.joinRoom(codigo).subscribe({
        next: (response) => {
          console.log('Unido a la sala:', response);
          this.userData = {
            room: response.room,
            userId: response.userid,
            name: response.name,
            email: response.email,
          };
          console.log(this.userData);
          this.socketService.connect();
          this.socketService.emitJugadorUnido(this.userData);
          this.unido = true;
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'No se pudo unir a la sala';
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.socketSubscriptions.forEach(subscription => subscription.unsubscribe());
    // No desconectar el socket aquí, ya que el jugador debe permanecer conectado.
  }

  private subscribeToSocketEvents(): void {
    this.socketSubscriptions.push(
      this.socketService.onActualizarJugadores().subscribe((players: Player[]) => {
        this.jugadores = players;
        console.log('Jugadores actualizados:', this.jugadores);
      })
    );

    this.socketSubscriptions.push(
      this.socketService.onSalaCerrada().subscribe(() => {
        console.log('Sala cerrada, redirigiendo al dashboard...');
        this.router.navigate(['/dashboard']);
      })
    );

    this.socketSubscriptions.push(
      this.socketService.onPartidaIniciada().subscribe((data: any) => {
        console.log('Partida iniciada:', data);
        this.router.navigate(['/playing/player', this.userData.room]);
      })
    );

    this.socketSubscriptions.push(
      this.socketService.onPartidaTerminada().subscribe((data: any) => {
        console.log('Partida terminada:', data);
        // Lógica adicional para manejar el fin de la partida si es necesario
      })
    );
  }
}
