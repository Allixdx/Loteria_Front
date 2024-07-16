import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/service/socket.service';

interface JugadorUnido {
  userId: string;
  roomId: string;
}

@Component({
  selector: 'app-unirse-sala',
  templateUrl: './unirse-sala.component.html',
  styleUrls: ['./unirse-sala.component.scss']
})
export class UnirseSalaComponent implements OnInit {

  joinRoomForm: FormGroup;
  jugadores: string[] = []; // Para almacenar los jugadores
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private loteriaService: LoteriaService, 
    private router: Router,
    private socketService: SocketService // Asegúrate de que este servicio esté creado
  ) {
    this.joinRoomForm = this.fb.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.joinRoomForm.valid) {
      const codigo = this.joinRoomForm.value.codigo;
      this.loteriaService.joinRoom(codigo).subscribe({
        next: (room) => {
          console.log('Unido a la sala:', room);
          
          // Unirse a la sala usando Socket.IO
          this.socketService.joinRoom(codigo);
          
          // Escuchar cuando un jugador se une
      this.socketService.onPlayerJoined((data) => {
        console.log('Jugador unido:', data);
        this.jugadores.push(data.userId);
      });
          
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error al unirse a la sala.';
          console.error('Error uniendo a la sala:', error);
        }
      });
    }
  }
}  