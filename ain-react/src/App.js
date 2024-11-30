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
  const [pageData, setPageData] = useState({});

  const handlePageChange = (newPage, data = {}) => {
    setCurrentPage(newPage);
    setPageData(data);
  };

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;