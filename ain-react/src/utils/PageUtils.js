import { HomePage, StorePage, CommunityPage, SearchPage, MyPage, LoginPage } from '../pages';
// 페이지 렌더링 함수

export const getPageTitle = (currentPage) => {
    switch (currentPage) {
      case 'store': return '스토어';
      case 'community': return '커뮤니티';
      case 'home': return '애니멀 인사이드';
      case 'search': return '검색';
      case 'mypage': return '마이페이지';
      default: return '애니멀 인사이드';
    }
  };
  
  export const renderPage = (currentPage) => {
    switch (currentPage) {
      case 'login': return <LoginPage />;
      case 'store': return <StorePage />;
      case 'community': return <CommunityPage />;
      case 'home': return <HomePage />;
      case 'search': return <SearchPage />;
      case 'mypage': return <MyPage />;
      default: return <HomePage />;
    }
  };