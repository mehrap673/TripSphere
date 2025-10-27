import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = `${environment.apiUrl}/weather`;

  constructor(private http: HttpClient) {}

  getWeatherForecast(lat: number, lng: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/destination?lat=${lat}&lng=${lng}`);
  }

  getCurrentWeather(lat: number, lng: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/current?lat=${lat}&lng=${lng}`);
  }
}
