import { Component, OnInit, HostListener } from '@angular/core';
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
  frijolitos: { top: number, left: number }[] = [];
  isDragging: boolean = false;
  currentFrijolito: any | null = null;
  offsetX: number = 0;
  offsetY: number = 0;

  constructor(private route: ActivatedRoute, private loteriaService: LoteriaService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = +params.get('roomId')!;
      console.log('Room ID:', this.roomId);
    });

    this.loteriaService.getCards().subscribe(cartas => {
      this.cartas = cartas;
      this.shuffleAndCreateCardTable(); // Inicializa la tabla de cartas al cargar
    });

    this.initializeFrijolitos();
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

  private initializeFrijolitos(): void {
    this.frijolitos = Array.from({ length: 16 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100
    }));
  }

  onMouseDown(event: MouseEvent, frijolito: any): void {
    this.isDragging = true;
    this.currentFrijolito = frijolito;
    this.offsetX = event.clientX - frijolito.left;
    this.offsetY = event.clientY - frijolito.top;
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.currentFrijolito) {
      this.currentFrijolito.left = event.clientX - this.offsetX;
      this.currentFrijolito.top = event.clientY - this.offsetY;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.currentFrijolito = null;
  }

  shuffleCards(): void {
    this.shuffleAndCreateCardTable(); // Mezcla las cartas y actualiza la tabla
  }
}
