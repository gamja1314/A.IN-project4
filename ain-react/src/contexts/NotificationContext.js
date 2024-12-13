// contexts/NotificationContext.js
import React, { createContext, useState, useContext } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import { authService } from '../services/authService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
  };

  // 단일 알림을 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        },
        body: JSON.stringify([notificationId])
      });

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // 모든 읽지 않은 알림을 읽음 처리
  const markAllAsRead = async () => {
    const unreadNotificationIds = notifications
      .filter(n => !n.is_read)
      .map(n => n.id);

    if (unreadNotificationIds.length === 0) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        },
        body: JSON.stringify(unreadNotificationIds)
      });

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // 읽지 않은 알림 개수 계산
  const getUnreadCount = () => {
    return notifications.filter(n => !n.is_read).length;
  };

  const value = {
    notifications,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);