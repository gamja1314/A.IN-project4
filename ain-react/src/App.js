import React from 'react';

const MobileLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen max-w-md mx-auto bg-white">
      {children}
    </div>
  );
};

const Header = ({ title }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-center z-50 max-w-md mx-auto">
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
};

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-50 max-w-md mx-auto">
      <button className="flex flex-col items-center justify-center w-1/5">
        <span className="text-sm">스토어</span>
      </button>
      <button className="flex flex-col items-center justify-center w-1/5">
        <span className="text-sm">커뮤니티</span>
      </button>
      <button className="flex flex-col items-center justify-center w-1/5">
        <span className="text-sm">홈</span>
      </button>
      <button className="flex flex-col items-center justify-center w-1/5">
        <span className="text-sm">검색</span>
      </button>
      <button className="flex flex-col items-center justify-center w-1/5">
        <span className="text-sm">마이페이지</span>
      </button>
    </nav>
  );
};

const MainContent = ({ children }) => {
  return (
    <main className="pt-14 pb-16 min-h-screen bg-gray-50">
      {children}
    </main>
  );
};

const App = () => {
  return (
    <MobileLayout>
      <Header title="애니멀 인사이드" />
      <MainContent>
        {/* Your page content goes here */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">최신 스토리</h2>
            {/* Story content */}
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">추천 피드</h2>
            {/* Feed content */}
          </div>
        </div>
      </MainContent>
      <BottomNav />
    </MobileLayout>
  );
};

export default App;