import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly socket = io(environment.socketUrl);

  constructor() {}

  public emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  public on(event: string) {
    return new Observable<any>((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }
}
