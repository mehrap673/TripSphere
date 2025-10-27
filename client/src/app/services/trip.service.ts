import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = `${environment.apiUrl}/trips`;
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMyTrips(status?: string, sort?: string): Observable<any> {
    let url = `${this.apiUrl}/my-trips`;
    const params: string[] = [];
    if (status) params.push(`status=${status}`);
    if (sort) params.push(`sort=${sort}`);
    if (params.length) url += `?${params.join('&')}`;

    return this.http.get(url).pipe(
      tap((response: any) => {
        if (response.success) {
          this.tripsSubject.next(response.trips);
        }
      })
    );
  }

  getTripById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createTrip(tripData: Partial<Trip>): Observable<any> {
    return this.http.post(this.apiUrl, tripData);
  }

  updateTrip(id: string, tripData: Partial<Trip>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tripData);
  }

  deleteTrip(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  shareTrip(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/share`, {});
  }

  addCollaborator(id: string, email: string, permission: 'view' | 'edit'): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/collaborators`, { email, permission });
  }

  completeTrip(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/complete`, {});
  }
}
