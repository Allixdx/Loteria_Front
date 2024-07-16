import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoteriaService {

  private apiUrl = environment.apiUrl;
  private token: string | null = null;
  private codigoSala: string | null = null; 

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
            this.token = tokenValue;
            console.log(`Token recibido: ${tokenValue}`);
          }
        })
      );
  }

  createRoom(): Observable<any> {
    const token = this.cookieService.get('token');
    console.log(token);
    const headers = { Authorization: `Bearer ${token}` };
  
    return this.http.post<any>(`${this.apiUrl}/rooms`, {}, { headers }).pipe(
      map((response: any) => {
        this.codigoSala = response.codigo;
        return this.codigoSala;
      })
    );
  }

  getCodigoSala(): string | null {
    return this.codigoSala;
  }

  joinRoom(codigo: string): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = { Authorization: `Bearer ${token}` };
  
    return this.http.post(`${this.apiUrl}/rooms/join`, { codigo }, { headers });
  }
  
}
