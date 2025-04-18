import React, { useCallback, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'; // React Router 임포트
import Header from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { MobileLayout } from './components/layout/MobileLayout';
import { BottomNav } from './components/navigation/BottomNav';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SomeoneInfo from './pages/auth/SomeoneInfo'; // 정확한 경로로 SomeoneInfo 임포트
import OAuthCallback from './pages/auth/OAuthCallback'; // OAuth 콜백 컴포넌트 임포트
import { notificationService } from './services/notificationService';
import { getPageTitle, renderPage } from './utils/PageUtils';

const AppContent = () => {
  // 상태 관리
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { isAuthenticated } = useAuth();
  const { setNotifications } = useNotification();
  const location = useLocation(); // 현재 위치 정보 가져오기

  useEffect(() => {
    // forceRefresh 상태를 확인하도록 수정
    if (location.pathname === '/' && location.state?.forceRefresh) {
      setCurrentPage('home');
      // 상태 초기화
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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


  /**
   * 페이지 전환 핸들러
   * 주요 변경사항: Header에 전달되는 title prop에서 handlePageChange를 함께 전달
   * 이를 통해 헤더의 뒤로가기 버튼이 페이지 전환 기능을 사용할 수 있음
   */
  const handlePageChange = (newPage, data = {}) => {
    setCurrentPage(newPage);
    setPageData(data);
    if (newPage === 'community') {
      refreshMessageCount();
    }
  };

  return (
    <MobileLayout>
      {/* Header 컴포넌트에 title prop으로 getPageTitle 호출 시 handlePageChange 함수 전달 */}
      <Header 
        title={getPageTitle(currentPage, pageData, handlePageChange)} 
      />
      <MainContent>
        {/* 페이지 렌더링 시에도 동일한 handlePageChange 전달 */}
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
        <Router> {/* React Router로 전체 앱 감싸기 */}
          <Routes>
            {/* 홈 경로 */}
            <Route path="/" element={<AppContent />} />

            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 특정 유저 프로필 페이지 라우팅 */}
            <Route path="/profile/:memberId" element={<SomeoneInfo />} />

            {/* OAuth 콜백 경로 추가 */}
            <Route path="/oauth2/callback" element={<OAuthCallback />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
