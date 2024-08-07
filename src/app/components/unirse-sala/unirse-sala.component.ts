import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

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
  codigoSala: string | null = null;
  private socketSubscriptions: Subscription[] = [];
  private roomId: number | null = null;
  private cdr: ChangeDetectorRef;

  constructor(
    private fb: FormBuilder, 
    private loteriaService: LoteriaService, 
    private socketService: SocketService,
    private router: Router,
    cdr: ChangeDetectorRef
  ) {
    this.joinRoomForm = this.fb.group({
      codigo: ['', Validators.required]
    });
    this.cdr = cdr;
  }

  ngOnInit(): void {
    // Intenta restaurar los datos de sessionStorage
    const storedData = sessionStorage.getItem('roomData');
    if (storedData) {
      const data = JSON.parse(storedData);
      this.codigoSala = data.codigoSala;
      this.roomId = data.roomId;
      console.log('Restaurando datos:', data);
      sessionStorage.removeItem('roomData');
      this.initializeComponent();
    } else {
      this.subscribeToSocketEvents();
    }
  }

  private initializeComponent(): void {
    if (this.roomId) {
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
          this.unido = true; // Establecer unido en true después de la inicialización exitosa
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
        }
      });
    } else {
      console.log('No se recibió ID de sala.');
    }
  }
  
  onSubmit(): void {
    if (this.joinRoomForm.valid) {
      this.codigoSala = this.joinRoomForm.value.codigo;
      if(this.codigoSala) {
        this.loteriaService.joinRoom(this.codigoSala).subscribe({
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
            this.unido = true; // Establecer unido en true después de unirse a la sala
          },
          error: (err) => {
            console.error('Error:', err);
            this.errorMessage = 'No se pudo unir a la sala';
          }
        });
      }
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
        this.router.navigate(['/playing/player', this.userData.room], { queryParams: { codigo: this.codigoSala } });
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
