import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  roomId: number | null = null;
  cartas: any[] = [];
  tablaCartas: any[][] = [];
  cartasMarcadas: Set<number> = new Set(); // Almacena IDs de cartas marcadas

  constructor(private route: ActivatedRoute, private loteriaService: LoteriaService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = +params.get('roomId')!;
      console.log('Room ID:', this.roomId);
    });

    this.loteriaService.getCards().subscribe(cartas => {
      this.cartas = cartas;
      this.shuffleAndCreateCardTable(); // Inicializa la tabla de cartas al cargar
      console.log(this.tablaCartas)
    });
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private shuffleAndCreateCardTable(): void {
    this.cartas = this.shuffleArray(this.cartas).slice(0, 16);
    this.createCardTable();
  }

  private createCardTable(): void {
    this.tablaCartas = [];
    for (let i = 0; i < 4; i++) {
      this.tablaCartas[i] = [];
      for (let j = 0; j < 4; j++) {
        this.tablaCartas[i][j] = this.cartas[i * 4 + j];
      }
    }
  }

  shuffleCards(): void {
    this.shuffleAndCreateCardTable(); // Mezcla las cartas y actualiza la tabla
  }

  toggleCard(cartaId: number): void {
    if (this.cartasMarcadas.has(cartaId)) {
      this.cartasMarcadas.delete(cartaId);
    } else {
      this.cartasMarcadas.add(cartaId);
    }
    console.log(this.cartasMarcadas)
  }
}
