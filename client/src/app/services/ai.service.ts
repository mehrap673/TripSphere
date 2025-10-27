import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  recommendDestinations(preferences: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend-destinations`, preferences);
  }

  suggestItinerary(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/suggest-itinerary`, data);
  }

  recommendHotels(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend-hotels`, data);
  }

  recommendActivities(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend-activities`, data);
  }

  getTravelTips(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/travel-tips`, data);
  }
}
