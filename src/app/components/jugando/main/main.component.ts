import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  cartas: any[] = [];
  currentCarta: any;
  currentIndex: number = 0;
  roomId: number | null = null;


  constructor(private loteriaService: LoteriaService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = +params.get('roomId')!;
      console.log('Room ID:', this.roomId);
    });


    this.loteriaService.getCards().subscribe(cartas => {
      this.cartas = this.shuffleArray(cartas);
      this.currentCarta = this.cartas[this.currentIndex];
    });
  }

  siguiente(): void {
    if (this.currentIndex < this.cartas.length - 1) {
      this.currentIndex++;
      this.currentCarta = this.cartas[this.currentIndex];
    }
  }

  anterior(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentCarta = this.cartas[this.currentIndex];
    }
  }

  // Fisher-Yates shuffle algorithm
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
