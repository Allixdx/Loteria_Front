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
  private jugadorUnidoSubscription: Subscription;

  constructor(
    private fb: FormBuilder, 
    private loteriaService: LoteriaService, 
    private socketService: SocketService,
    private router: Router
  ) {
    this.joinRoomForm = this.fb.group({
      codigo: ['', Validators.required]
    });
    this.jugadorUnidoSubscription = new Subscription();
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.joinRoomForm.valid) {
      const codigo = this.joinRoomForm.value.codigo;
      this.loteriaService.joinRoom(codigo).subscribe({
        next: (response) => {
          console.log('Unido a la sala:', response);
          this.userData = {
            room: response.room,
            userid: response.userid,
            name: response.name,
            email: response.email,
          };
          console.log(this.userData);
          this.socketService.connect();
          this.emitJugadorUnido();
          this.unido = true;

          // Suscribirse al evento de jugador unido
          this.jugadorUnidoSubscription = this.socketService.onJugadorUnido().subscribe((data: Player) => {
            this.jugadores.push(data);
            console.log('Jugador unido:', data);
          });
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'No se pudo unir a la sala';
        }
      });
    }
  }

  emitJugadorUnido(): void {
    this.socketService.emitJugadorUnido(this.userData);
  }

  ngOnDestroy(): void {
    this.jugadorUnidoSubscription.unsubscribe();
    this.socketService.disconnect();
  }
}
