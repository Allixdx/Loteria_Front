import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


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
  private socketSubscriptions: Subscription[] = [];


  constructor(private route: ActivatedRoute, private loteriaService: LoteriaService,     private socketService: SocketService,     private router: Router

    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = +params.get('roomId')!;
      console.log('Room ID:', this.roomId);
    });

    this.loteriaService.getCards().subscribe(cartas => {
      this.cartas = cartas;
      this.shuffleAndCreateCardTable(); // Inicializa la tabla de cartas al cargar
      console.log(this.tablaCartas);
    });

    this.subscribeToSocketEvents(); 
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private shuffleAndCreateCardTable(): void {
    // Filtrar la carta "cheems" si existe
    this.cartas = this.cartas.filter(carta => carta.name !== 'cheems');
    
    // Barajar las cartas restantes y tomar solo las primeras 16
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
    console.log(this.cartasMarcadas);
  }
  
  celebrateVictory(): void {
    // Lógica para cantar victoria
    console.log('¡Victoria!');
    alert('¡Cantar Victoria!');
  }

  private subscribeToSocketEvents(): void {

    this.socketSubscriptions.push(
      this.socketService.onCartaCantada().subscribe((data: any) => {
        console.log('Carta cantada:', data.carta);
      })
    );
  

    this.socketSubscriptions.push(
      this.socketService.onSalaCerrada().subscribe(() => {
        console.log('Sala cerrada, redirigiendo al dashboard...');
        this.router.navigate(['/dashboard']);
      })
    );

    this.socketSubscriptions.push(
      this.socketService.onPartidaTerminada().subscribe((data: any) => {
        console.log('Partida terminada:', data);
        // Lógica adicional para manejar el fin de la partida si es necesario
      })
    );
  }
}
