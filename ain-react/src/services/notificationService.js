import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


class NotificationWebSocket {
    constructor() {
      this.client = null;
      this.onNotificationReceived = null;
    }
  
    setNotificationCallback(callback) {
      this.onNotificationReceived = callback;
    }
  
    connect() {
      const token = authService.getToken();
  
      this.client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        
        onConnect: (frame) => {
          console.log('Connected: ' + frame);
          this.subscribe();
          this.client.publish({
            destination: '/app/notifications/unread'
          });
        }
      });
  
      try {
        this.client.activate();
      } catch (err) {
        console.error('WebSocket connection error:', err);
      }
    }
  
    subscribe() {
      this.client.subscribe('/user/queue/notifications', message => {
        const notifications = JSON.parse(message.body);
        if (this.onNotificationReceived) {
          this.onNotificationReceived(notifications);
        }
      });
    }
  
    disconnect() {
      if (this.client) {
        this.client.deactivate();
      }
    }
  }
  
  export const notificationService = new NotificationWebSocket();