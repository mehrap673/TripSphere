import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) {}

  getHotels(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  getHotelById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getHotelsByDestination(destinationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/destination/${destinationId}`);
  }

  getFeaturedHotels(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/featured`);
  }

  searchHotels(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}
