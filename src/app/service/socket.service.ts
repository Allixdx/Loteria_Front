import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { 
    this.socket.on('connect', () => {
      console.log('Socket conectado');
    });
  }
  

  joinRoom(codigo: string): void {
    this.socket.emit('joinRoom', { codigo });
  }

  public onPlayerJoined(callback: (data: any) => void) {
    this.socket.on('jugadorUnido', callback);
    console.log("aaaa")
  }


  onRoomCreated(): Observable<any> {
    return this.socket.fromEvent('roomCreated');
  }

}
