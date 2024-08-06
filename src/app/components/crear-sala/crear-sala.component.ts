import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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
  roomId: number | null = null;
  jugadores: Player[] = [];
  private socketSubscription: Subscription = new Subscription();
  private userData: any;
  private cdr: ChangeDetectorRef;


  constructor(
    private fb: FormBuilder,
    private loteriaService: LoteriaService,
    private socketService: SocketService,
    private router: Router,
    cdr: ChangeDetectorRef

  ) {
    this.crearSalaForm = this.fb.group({});
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
      this.crearSala();
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
          this.cdr.detectChanges(); // Ahora debería funcionar
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
        }
      });
    } else {
      console.log('No se recibió ID de sala.');
    }
  }
  

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }

  private subscribeToSocketEvents(): void {
    this.socketSubscription.add(
      this.socketService.onActualizarJugadores().subscribe((players: Player[]) => {
        this.jugadores = players;
        console.log('Jugadores actualizados:', this.jugadores);
      })
    );

    this.socketSubscription.add(
      this.socketService.onPartidaIniciada().subscribe(() => {
        this.router.navigate(['/playing/main', this.roomId]);
      })
    );

    this.socketSubscription.add(
      this.socketService.onPartidaTerminada().subscribe((data: any) => {
        console.log('Partida terminada:', data);
      })
    );
  }

  crearSala(): void {
    this.loteriaService.createRoom().subscribe({
      next: (data) => {
        console.log('Datos recibidos al crear sala:', data);
        this.codigoSala = data.codigoSala; // Asegúrate de que esta línea esté presente
        this.roomId = data.roomId;
        console.log(`Sala creada con el código: ${this.codigoSala} y ID: ${this.roomId}`);
        this.initializeComponent();
      },
      error: (error) => {
        console.error('Error al crear la sala', error);
      }
    });
  }

  iniciarPartida(): void {
    if (this.roomId) {
      this.loteriaService.startGame(this.roomId).subscribe(
        response => {
          console.log('Partida iniciada con éxito', response);
          this.socketService.emitIniciarPartida(this.roomId);
        },
        error => {
          console.error('Error al iniciar la partida', error);
        }
      );
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
          this.router.navigate(['/dashboard']);
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
