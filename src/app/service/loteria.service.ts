import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoteriaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            const tokenValue = response.token.token;
            this.cookieService.set('token', tokenValue);
            console.log(`Token recibido: ${tokenValue}`);
          }
        })
      );
  }

  createRoom(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/rooms`, {}, { headers }).pipe(
      map((response: any) => {
        return {
          codigoSala: response.room.codigo,
          roomId: response.id
        };
      })
    );
  }

  joinRoom(codigo: string): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(`${this.apiUrl}/rooms/join`, { codigo }, { headers });
  }

  getUser(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  closeRoom(roomId: number): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/rooms/close`, { roomId }, { headers });
  }

  startGame(roomId: number): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/rooms/start`, { roomId }, { headers });
  }

  getCards(): Observable<any[]> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/cartas`, { headers });
  }

  getRoomsByOrganizador(): Observable<any[]> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/rooms/createdby`, {headers});
  }

  getPlayersByRoom(roomId: number): Observable<any[]> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/players/${roomId}`, {headers});
  }

  getWinnersByRoom(roomId: number): Observable<any[]> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/winners/${roomId}`, {headers});
  }

  getRoomsWonByUser(): Observable<any[]> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/rooms-won`, { headers });
  }


}
