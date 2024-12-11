import React, { useState, useEffect } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import Header from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { BottomNav } from './components/navigation/BottomNav';
import { getPageTitle, renderPage } from './utils/PageUtils';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { notificationService } from './services/notificationService';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const { isAuthenticated } = useAuth();
  const { setNotifications } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      // 알림 콜백 설정
      notificationService.setNotificationCallback((notifications) => {
        setNotifications(notifications);
      });

      // 소켓 연결
      notificationService.connect();

      // 컴포넌트 언마운트 시 소켓 연결 해제
      return () => {
        notificationService.disconnect();
      };
    }
  }, [isAuthenticated, setNotifications]);

  const handlePageChange = (newPage, data = {}) => {
    setCurrentPage(newPage);
    setPageData(data);
  };

  return (
    <MobileLayout>
      <Header title={getPageTitle(currentPage, pageData)} />
      <MainContent>
        {renderPage(currentPage, pageData, handlePageChange)}
      </MainContent>
      <BottomNav 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
      />
    </MobileLayout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;