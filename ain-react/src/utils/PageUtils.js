import { CommunityPage, CreateStory, HomePage, LoginPage, MyPage, MyStories, PlacePage, SearchPage, SomeoneInfo } from '../pages';
import { FollowerList } from '../pages/auth/FollowerList';
import ChatRoom from '../pages/chat/ChatRoom';
import { ProtectedRoute } from './ProtectedRoute';

const PROTECTED_PAGES = {
  'place': true,
  'community': true,
  'home': false,
  'search': true,
  'mypage': true,
  'login': false,
  'chatRoom': true,
  'someoneInfo': false,
  'createStory': true,
  'MyStories': true,
  'followerList': false,
};

export const getPageTitle = (currentPage, pageData = {}) => {
  switch (currentPage) {
    case 'chatRoom': return `${pageData?.roomName}`;
    case 'place': return '장소';
    case 'community': return '커뮤니티';
    case 'home': return '애니멀 인사이드';
    case 'search': return '검색';
    case 'mypage': return '마이페이지';
    case 'someoneInfo': return `${pageData?.name}`;
    case 'createStory': return '스토리 만들기';
    case 'myStories': return '내 스토리';
    case 'followerList': return pageData?.listType === 'followers' ? '팔로워' : '팔로잉';
    default: return '애니멀 인사이드';
  }
};

export const renderPage = (currentPage, pageData = {}, onPageChange, refreshMessageCount) => {
  const getPageComponent = () => {
    switch (currentPage) {
      case 'chatRoom': 
        return <ChatRoom 
          roomId={pageData?.roomId} 
          currentUser={pageData?.currentUser}
          onPageChange={onPageChange}
          onExit={refreshMessageCount}
          onMessageSent={refreshMessageCount}
        />;
      case 'community': 
        return <CommunityPage 
          onPageChange={(page, data) => {
            if (page !== 'chatRoom') {
              refreshMessageCount();
            }
            onPageChange(page, data);
          }} 
        />;
      case 'login': return <LoginPage />;
      case 'place': return <PlacePage />;
      case 'home': return <HomePage onPageChange={onPageChange} />;
      case 'search': return <SearchPage />;
      case 'mypage': return <MyPage />;
      case 'someoneInfo': return <SomeoneInfo pageData={pageData} onPageChange={onPageChange} />;
      case 'createStory': return <CreateStory onPageChange={onPageChange} />;
      case 'myStories': return <MyStories onPageChange={onPageChange} />;
      case 'followerList': return <FollowerList pageData={pageData} onPageChange={onPageChange} />;
      default: return <HomePage />;
    }
  };

  return PROTECTED_PAGES[currentPage] ? (
    <ProtectedRoute>
      {getPageComponent()}
    </ProtectedRoute>
  ) : getPageComponent();
};