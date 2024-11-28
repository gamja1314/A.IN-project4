import { HomePage, PlacePage, CommunityPage, SearchPage, MyPage, LoginPage } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';

// 페이지별 인증 필요 여부 설정
const PROTECTED_PAGES = {
  'place': true,
  'community': true,
  'home': false,
  'search': true,
  'mypage': true,
  'login': false
};

export const getPageTitle = (currentPage) => {
  switch (currentPage) {
    case 'place': return '장소';
    case 'community': return '커뮤니티';
    case 'home': return '애니멀 인사이드';
    case 'search': return '검색';
    case 'mypage': return '마이페이지';
    default: return '애니멀 인사이드';
  }
};

export const renderPage = (currentPage) => {
  const getPageComponent = () => {
    switch (currentPage) {
      case 'login': return <LoginPage />;
      case 'place': return <PlacePage />;
      case 'community': return <CommunityPage />;
      case 'home': return <HomePage />;
      case 'search': return <SearchPage />;
      case 'mypage': return <MyPage />;
      default: return <HomePage />;
    }
  };

  // 보호된 페이지인 경우 ProtectedRoute로 감싸서 반환
  return PROTECTED_PAGES[currentPage] ? (
    <ProtectedRoute>
      {getPageComponent()}
    </ProtectedRoute>
  ) : getPageComponent();
};