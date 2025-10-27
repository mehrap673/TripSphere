import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivities(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  getActivityById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getActivitiesByDestination(destinationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/destination/${destinationId}`);
  }

  searchActivities(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: { q: searchTerm }
    });
  }

  getActivitiesByType(type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`);
  }
}
