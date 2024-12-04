import { HomePage, PlacePage, CommunityPage, SearchPage, MyPage, LoginPage, SomeoneInfo } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';
import ChatRoom from '../pages/chat/ChatRoom';  // ChatRoom import 추가

// 페이지별 인증 필요 여부 설정
const PROTECTED_PAGES = {
  'place': true,
  'community': true,
  'home': false,
  'search': true,
  'mypage': true,
  'login': false,
  'chatRoom': true,
  'someoneInfo': false
};

export const getPageTitle = (currentPage, pageData = {}) => {  // pageData 매개변수 추가
  switch (currentPage) {
    case 'chatRoom': return `${pageData?.roomName}`;
    case 'place': return '장소';
    case 'community': return '커뮤니티';
    case 'home': return '애니멀 인사이드';
    case 'search': return '검색';
    case 'mypage': return '마이페이지';
    case 'someoneInfo': return `${pageData?.name}`;
    default: return '애니멀 인사이드';
  }
};

export const renderPage = (currentPage, pageData = {}, onPageChange) => {  // pageData와 onPageChange 매개변수 추가
  const getPageComponent = () => {
    switch (currentPage) {
      case 'chatRoom': return <ChatRoom 
        roomId={pageData?.roomId} 
        currentUser={pageData?.currentUser}
      />;
      case 'login': return <LoginPage />;
      case 'place': return <PlacePage />;
      case 'community': return <CommunityPage onPageChange={onPageChange} />;
      case 'home': return <HomePage />;
      case 'search': return <SearchPage />;
      case 'mypage': return <MyPage />;
      case 'someoneInfo': return <SomeoneInfo />;
      default: return <HomePage />;
    }
  };

  return PROTECTED_PAGES[currentPage] ? (
    <ProtectedRoute>
      {getPageComponent()}
    </ProtectedRoute>
  ) : getPageComponent();
};