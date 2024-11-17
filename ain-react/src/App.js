// App.js
import React, { useState } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import { Header } from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { BottomNav } from './components/navigation/BottomNav';
import { getPageTitle, renderPage } from './utils/PageUtils';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <MobileLayout>
      <Header title={getPageTitle(currentPage)} />
      <MainContent>
        {renderPage(currentPage)}
      </MainContent>
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </MobileLayout>
  );
};

export default App;