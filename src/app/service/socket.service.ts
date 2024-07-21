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

  onPartidaIniciada(): Observable<any> {
    return this.socket.fromEvent('partidaIniciada');
  }

}
