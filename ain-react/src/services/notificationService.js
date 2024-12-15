import { socketService } from "./SocketService";

class NotificationService {
  constructor() {
    this.onNotificationReceived = null;
  }

  setNotificationCallback(callback) {
    this.onNotificationReceived = callback;
  }

  connect() {
    socketService.subscribe('/user/queue/notifications', message => {
      const notifications = JSON.parse(message.body);
      if (this.onNotificationReceived) {
        this.onNotificationReceived(notifications);
      }
    });

    socketService.connect(
      () => {
        socketService.publish('/app/notifications/unread');
      },
      (error) => {
        console.error('Notification connection error:', error);
      }
    );
  }

  disconnect() {
    socketService.disconnect();
  }
}

export const notificationService = new NotificationService();