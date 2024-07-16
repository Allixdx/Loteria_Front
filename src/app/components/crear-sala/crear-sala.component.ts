import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoteriaService } from 'src/app/service/loteria.service';

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.scss']
})
export class CrearSalaComponent implements OnInit {

  crearSalaForm: FormGroup;
  codigoSala: string | null = null;
  jugadores: string[] = [];

  constructor(private fb: FormBuilder, private loteriaService: LoteriaService) {
    this.crearSalaForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.codigoSala = this.loteriaService.getCodigoSala();
    if (this.codigoSala) {
      console.log(`Código de sala recibido: ${this.codigoSala}`);
    } else {
      console.log('No se recibió código de sala.');
    }
  }

  iniciarPartida() {
    // Lógica para iniciar la partida
  }

  cerrarSala() {
    // Lógica para cerrar la sala
  }
}
