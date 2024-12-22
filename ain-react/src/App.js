import React, { useState, useEffect, useCallback } from 'react';
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
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { isAuthenticated } = useAuth();
  const { setNotifications } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.setNotificationCallback((notifications) => {
        setNotifications(notifications);
      });
      notificationService.connect();
      return () => {
        notificationService.disconnect();
      };
    }
  }, [isAuthenticated, setNotifications]);

  const refreshMessageCount = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  const handlePageChange = (newPage, data = {}) => {
    setCurrentPage(newPage);
    setPageData(data);
    if (newPage === 'community') {
      refreshMessageCount();
    }
  };

  return (
    <MobileLayout>
      <Header title={getPageTitle(currentPage, pageData)} />
      <MainContent>
        {renderPage(currentPage, pageData, handlePageChange, refreshMessageCount)}
      </MainContent>
      <BottomNav 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        refreshTrigger={refreshCounter}
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