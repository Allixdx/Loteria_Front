import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  emitJugadorUnido(data: any): void {
    this.socket.emit('jugadorUnido', data);
  }

  onActualizarJugadores(): Observable<any> {
    return this.socket.fromEvent('actualizarJugadores');
  }

  emitSalaCerrada(roomId: any): void {
    this.socket.emit('salaCerrada', roomId);
  }

  onSalaCerrada(): Observable<any> {
    return this.socket.fromEvent('salaCerrada');
  }

  emitIniciarPartida(roomId: any): void {
    this.socket.emit('iniciarPartida', { roomId });
  }

  onPartidaIniciada(): Observable<any> {
    return this.socket.fromEvent('partidaIniciada');
  }

  emitTerminarPartida(roomId: any): void {
    this.socket.emit('terminarPartida', { roomId });
  }

  onPartidaTerminada(): Observable<any> {
    return this.socket.fromEvent('partidaTerminada');
  }

  emitCartaCantada(roomId: number, carta: any): void {
    this.socket.emit('cartaCantada', { roomId, carta });
  }

  onCartaCantada(): Observable<any> {
    return this.socket.fromEvent('cartaCantada');
  }

  // Nuevo método para solicitar la verificación de cartas
  emitVerificarCartas(roomId: number, cartasMarcadas: number[]): void {
    this.socket.emit('verificarCartas', { roomId, cartasMarcadas });
  }

  // Nuevo método para escuchar el resultado de la verificación de cartas
  onResultadoVerificacionCartas(): Observable<any> {
    return this.socket.fromEvent('resultadoVerificacionCartas');
  }
}
