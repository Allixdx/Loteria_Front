import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface Player {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  cartas: any[] = [];
  cartasCantadas: any[] = [];
  currentCarta: any;
  currentIndex: number = 0;
  roomId: number | null = null;
  jugadores: Player[] = [];
  private socketSubscription: Subscription = new Subscription();

  constructor(private loteriaService: LoteriaService, private route: ActivatedRoute, private socketService: SocketService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = +params.get('roomId')!;
      console.log('Room ID:', this.roomId);
    });

    this.subscribeToSocketEvents();

    this.loteriaService.getCards().subscribe(cartas => {
      this.cartas = this.shuffleArray(cartas);
      
      const cheeemsCarta = this.cartas.find(carta => carta.name === 'cheems');
      if (cheeemsCarta) {
        this.cartas = this.cartas.filter(carta => carta.name !== 'cheems');
        this.cartas.unshift(cheeemsCarta);
      }

      this.currentCarta = this.cartas[this.currentIndex];
    });
  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
    this.socketService.disconnect();
  }

  siguiente(): void {
    // Avanzar al siguiente índice y actualizar currentCarta
    if (this.currentIndex < this.cartas.length - 1) {
      this.currentIndex++;
      this.currentCarta = this.cartas[this.currentIndex];
      if (this.currentCarta && !this.cartasCantadas.some(carta => carta.id === this.currentCarta.id)) {
        this.cartasCantadas.push(this.currentCarta);
      }
    } else {
      // Opcional: Manejar el caso cuando ya no hay más cartas
      console.log('No hay más cartas.');
    }
    console.log(this.cartasCantadas);
  }
  
  anterior(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentCarta = this.cartas[this.currentIndex];
    }
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private subscribeToSocketEvents(): void {
    this.socketSubscription.add(
      this.socketService.onActualizarJugadores().subscribe((players: Player[]) => {
        this.jugadores = players;
        console.log('Jugadores actualizados:', this.jugadores);
      })
    );

    this.socketSubscription.add(
      this.socketService.onPartidaIniciada().subscribe((data: any) => {
        console.log('Partida iniciada:', data);
        // Lógica adicional para manejar el inicio de la partida
      })
    );

    this.socketSubscription.add(
      this.socketService.onPartidaTerminada().subscribe((data: any) => {
        console.log('Partida terminada:', data);
        // Lógica adicional para manejar el fin de la partida
      })
    );
  }
}
