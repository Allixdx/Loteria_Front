import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PlayerComponent implements OnInit, OnDestroy {
  roomId: number | null = null;
  cartas: any[] = [];
  tablaCartas: any[][] = [];
  codigoSala: string | null = null;
  cartasMarcadas: Set<number> = new Set(); // Almacena IDs de cartas marcadas
  private socketSubscriptions: Subscription[] = [];
  allCardsMarked: boolean = false; // Estado para habilitar el botón

  constructor(
    private route: ActivatedRoute, 
    private loteriaService: LoteriaService, 
    private socketService: SocketService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = +params.get('roomId')!;
      console.log('Room ID:', this.roomId);
    });

    this.route.queryParamMap.subscribe(queryParams => {
      this.codigoSala = queryParams.get('codigo');
      console.log('Código de Sala:', this.codigoSala);
    });

    this.loteriaService.getCards().subscribe(cartas => {
      this.cartas = cartas;
      this.shuffleAndCreateCardTable(); // Inicializa la tabla de cartas al cargar
      console.log(this.tablaCartas);
    });

    this.subscribeToSocketEvents(); 
  }

  ngOnDestroy(): void {
    this.socketSubscriptions.forEach(subscription => subscription.unsubscribe());
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
    this.tablaCartas = this.shuffleArray(this.cartas).slice(0, 16);

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
    this.checkAllCardsMarked(); // Verificar si todas las cartas están marcadas
    console.log(this.cartasMarcadas);
  }
  
  private checkAllCardsMarked(): void {
    // Verifica si todas las cartas están marcadas
    const totalCards = this.tablaCartas.flat().length; // Total de cartas en la tabla
    this.allCardsMarked = this.cartasMarcadas.size === totalCards;
  }

  private handleVictory(data: any): void {
    // Almacena el estado en localStorage o sessionStorage
    sessionStorage.setItem('roomData', JSON.stringify({ roomId: this.roomId, codigoSala: this.codigoSala, ...data }));

    this.router.navigate(['/unirseSala']);
  }

  celebrateVictory(): void {
    if (this.allCardsMarked) {
      console.log('Cartas marcadas para verificar:', Array.from(this.cartasMarcadas)); 
      if (this.roomId) {
        const socketId = this.socketService.getSocketId();
        this.socketService.emitVerificarCartas(this.roomId, Array.from(this.cartasMarcadas), socketId);
        
        this.socketSubscriptions.push(
          this.socketService.onResultadoVerificacionCartas().subscribe((data: any) => {
            console.log('Resultado de verificación de cartas:', data.result);
            if (data.result) {
              console.log('¡Victoria!');
            } else {
              alert('No todas las cartas marcadas han sido cantadas.');
            }
          })
        );
      }
    } else {
      alert('No todas las cartas están marcadas.');
    }
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
        this.handleVictory(data);
      })
    );

    this.socketSubscriptions.push(
      this.socketService.onResultadoVerificacionCartas().subscribe((data: any) => {
        console.log('Resultado de verificación de cartas:', data.result);
      })
    );

    this.socketSubscriptions.push(
      this.socketService.onVictoriaAnunciada().subscribe((data: any) => {
        alert(`¡${data.userName} ha ganado la partida!`);
        this.handleVictory(data);
      })
    );
  }
}
