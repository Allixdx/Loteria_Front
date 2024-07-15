import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  joinRoom(codigo: string): void {
    this.socket.emit('joinRoom', { codigo });
  }

  onPlayerJoined(): Observable<any> {
    return this.socket.fromEvent('jugadorUnido');
  }

  onRoomCreated(): Observable<any> {
    return this.socket.fromEvent('roomCreated');
  }
}
