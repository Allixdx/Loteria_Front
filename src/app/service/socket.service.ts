import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  emitJugadorUnido(data: any): void {
    console.log("emittiendo el de jugadorUnido")
    this.socket.emit('jugadorUnido', data);
  }

  onJugadorUnido(): Observable<any> {
    console.log("escuchando lo de el de jugadorUnido")
    return this.socket.fromEvent('jugadorUnido');
  }
}
