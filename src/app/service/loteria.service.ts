import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoteriaService {

  private apiUrl = 'environment.apiUrl';

  constructor(private http: HttpClient) { }

  // Crear una sala
  createRoom(): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-room`, {});
  }

  // Unirse a una sala
  joinRoom(codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/join-room`, { codigo });
  }
}
