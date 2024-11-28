export const BottomNav = ({ currentPage, onPageChange }) => {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-[1000] max-w-md mx-auto">
        <button 
          className={`flex flex-col items-center justify-center w-1/5 ${currentPage === 'place' ? 'text-blue-500' : ''}`}
          onClick={() => onPageChange('place')}
        >
          <span className="text-sm">장소</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center w-1/5 ${currentPage === 'community' ? 'text-blue-500' : ''}`}
          onClick={() => onPageChange('community')}
        >
          <span className="text-sm">커뮤니티</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center w-1/5 ${currentPage === 'home' ? 'text-blue-500' : ''}`}
          onClick={() => onPageChange('home')}
        >
          <span className="text-sm">홈</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center w-1/5 ${currentPage === 'search' ? 'text-blue-500' : ''}`}
          onClick={() => onPageChange('search')}
        >
          <span className="text-sm">검색</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center w-1/5 ${currentPage === 'mypage' ? 'text-blue-500' : ''}`}
          onClick={() => onPageChange('mypage')}
        >
          <span className="text-sm">마이페이지</span>
        </button>
      </nav>
    );
  };