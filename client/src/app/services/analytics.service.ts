import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getUserAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getTripAnalytics(tripId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trip/${tripId}`);
  }

  getDestinationAnalytics(destinationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/destination/${destinationId}`);
  }

  getComparisonAnalytics(tripIds: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/comparison`, { tripIds });
  }

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }
}
