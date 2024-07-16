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

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
    .pipe(
      tap(response => {
        if (response.token) {
          this.cookieService.set('token', response.token);
          this.token = response.token;
        }
      })
    );
  }

  createRoom(): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, {}).pipe(
      map((response: any) => response.codigo)
    );
  }
}
