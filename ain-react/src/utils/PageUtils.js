import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { CommunityPage, CreateStory, HomePage, LoginPage, MyPage, MyStories, PlacePage, SearchPage, SomeoneInfo } from '../pages';
import { FollowerList } from '../pages/auth/FollowerList';
import ChatRoom from '../pages/chat/ChatRoom';
import { ProtectedRoute } from './ProtectedRoute';

// 각 페이지의 보호 여부를 정의하는 객체
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

export const getPageTitle = (currentPage, pageData = {}, onPageChange = null) => {
  const getTitleContent = () => {
    switch (currentPage) {
      case 'followerList':
        return (
          <div className="flex items-center">
            {onPageChange && (
              <button 
                onClick={() => onPageChange('someoneInfo', { 
                  memberId: pageData.memberId,
                  name: pageData.name 
                })}
                className="p-2 hover:bg-gray-100 rounded-full mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <span>{pageData?.listType === 'followers' ? '팔로워' : '팔로잉'}</span>
          </div>
        );
      case 'chatRoom': return `${pageData?.roomName}`;
      case 'place': return '장소';
      case 'community': return '커뮤니티';
      case 'home': return '애니멀 인사이드';
      case 'search': return '검색';
      case 'mypage': return '마이페이지';
      case 'someoneInfo': return `${pageData?.name}`;
      case 'createStory': return '스토리 만들기';
      case 'myStories': return '내 스토리';
      default: return '애니멀 인사이드';
    }
  };

  return getTitleContent();
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