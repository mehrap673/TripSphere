import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Destination } from '../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = `${environment.apiUrl}/destinations`;
  private destinationsSubject = new BehaviorSubject<Destination[]>([]);
  public destinations$ = this.destinationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getDestinations(options?: {
    category?: string;
    search?: string;
    sort?: string;
    useAmadeus?: boolean;
    limit?: number;
  }): Observable<any> {
    // ✅ Use HttpParams for better query string handling
    let params = new HttpParams();
    
    if (options?.category) {
      params = params.set('category', options.category);
    }
    if (options?.search) {
      params = params.set('search', options.search);
    }
    if (options?.sort) {
      params = params.set('sort', options.sort);
    }
    if (options?.useAmadeus) {
      params = params.set('useAmadeus', 'true'); // ✅ Send as string
    }
    if (options?.limit) {
      params = params.set('limit', options.limit.toString());
    }

    return this.http.get(this.apiUrl, { params }).pipe(
      tap((response: any) => {
        if (response.success) {
          this.destinationsSubject.next(response.destinations);
        }
      })
    );
  }

  getFeaturedDestinations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/featured`);
  }

  getDestinationById(id: string, enrichWithAmadeus?: boolean): Observable<any> {
    let params = new HttpParams();
    if (enrichWithAmadeus) {
      params = params.set('enrichWithAmadeus', 'true');
    }
    return this.http.get(`${this.apiUrl}/${id}`, { params });
  }

  addReview(id: string, review: { rating: number; comment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reviews`, review);
  }

  // ✅ New method specifically for Amadeus search
  searchWithAmadeus(keyword: string, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('search', keyword)
      .set('useAmadeus', 'true')
      .set('limit', limit.toString());
    
    return this.http.get(this.apiUrl, { params });
  }
}
