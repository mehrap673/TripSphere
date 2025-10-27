import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      autoConnect: false
    });
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  joinTrip(tripId: string): void {
    this.socket.emit('join-trip', tripId);
  }

  leaveTrip(tripId: string): void {
    this.socket.emit('leave-trip', tripId);
  }

  onTripUpdated(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('trip-updated', (data: any) => {
        observer.next(data);
      });
    });
  }

  onActivityUpdated(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('activity-updated', (data: any) => {
        observer.next(data);
      });
    });
  }

  onBudgetUpdated(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('budget-updated', (data: any) => {
        observer.next(data);
      });
    });
  }

  emitTripUpdate(data: any): void {
    this.socket.emit('trip-update', data);
  }

  emitActivityAdded(data: any): void {
    this.socket.emit('activity-added', data);
  }

  emitBudgetUpdate(data: any): void {
    this.socket.emit('budget-update', data);
  }
}
