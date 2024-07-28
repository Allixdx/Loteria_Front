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
}
