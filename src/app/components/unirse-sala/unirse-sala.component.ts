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

  constructor(private fb: FormBuilder) {
    this.joinRoomForm = this.fb.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.joinRoomForm.valid) {

    }
  }
}  