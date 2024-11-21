// App.js
import React, { useState } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import { Header } from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { BottomNav } from './components/navigation/BottomNav';
import { getPageTitle, renderPage } from './utils/PageUtils';
import { AuthProvider } from './hooks/useAuth';  // AuthProvider import 추가

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <AuthProvider>      {/* AuthProvider로 전체 앱을 감싸기 */}
      <MobileLayout>
        <Header title={getPageTitle(currentPage)} />
        <MainContent>
          {renderPage(currentPage)}
        </MainContent>
        <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
      </MobileLayout>
    </AuthProvider>
  );
};

export default App;