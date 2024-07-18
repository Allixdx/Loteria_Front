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
  private actualizarPlayer: Subscription;

  constructor(
    private fb: FormBuilder, 
    private loteriaService: LoteriaService, 
    private socketService: SocketService,
    private router: Router
  ) {
    this.joinRoomForm = this.fb.group({
      codigo: ['', Validators.required]
    });
    this.actualizarPlayer = new Subscription();
  }

  ngOnInit(): void {
    this.actualizarPlayer = this.socketService.onActualizarJugadores().subscribe((players: Player[]) => {
      this.jugadores = players;
      console.log('Jugadores actualizados:', this.jugadores);
    });
  }

  onSubmit() {
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
    this.actualizarPlayer.unsubscribe();
    this.socketService.disconnect();
  }
}
