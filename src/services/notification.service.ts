import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications() {
    return this.http.get(`https://node.secureprivacy.ai/api/common/getNotification`);
  }
}
