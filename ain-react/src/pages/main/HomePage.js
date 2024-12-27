import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from "../../services/authService";
import StoryProfile from '../story/StoryProfile';
import PostForm from "../../components/posts/PostForm";
import PostCard from "../../components/posts/PostCard";

const HomePage = ({ onPageChange }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);  // 0부터 시작하도록 수정
  const [hasMore, setHasMore] = useState(true);
  const [stories, setStories] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (loading) return; // 이미 로딩 중이면 중단
  
    try {
      setLoading(true);
      const size = 10;
      const response = await fetch(
        `${API_BASE_URL}/api/posts/page?page=${page}&size=${size}`, 
        {
          method: "GET",
          headers: {
            ...authService.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) throw new Error("게시물 데이터를 가져오는데 실패했습니다.");
  
      const data = await response.json();
      
      if (data.content && data.content.length > 0) {
        setPosts(prevPosts => {
          const newPosts = [...prevPosts];
          data.content.forEach(post => {
            if (!newPosts.find(p => p.id === post.id)) {
              newPosts.push(post);
            }
          });
          return newPosts;
        });
        
        setHasMore(!data.last);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
  
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("게시물을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [page]); // loading 제거, page만 의존성으로 유지
  
  // 초기 데이터 로딩을 위한 useEffect
  useEffect(() => {
    if (page === 0) { // 초기 로딩일 때만 실행
      fetchPosts();
    }
  }, [fetchPosts]);

  // 게시글 등록 후 처리
  const handlePostSubmitted = async () => {
    try {
      setLoading(true);
      setPosts([]); // 기존 포스트 초기화
      setPage(0); // 페이지 초기화
      setHasMore(true); // hasMore 초기화
      
      // 직접 첫 페이지 데이터를 가져옴
      const response = await fetch(
        `${API_BASE_URL}/api/posts/page?page=0&size=10`, 
        {
          method: "GET",
          headers: {
            ...authService.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("게시물을 가져오는데 실패했습니다.");

      const data = await response.json();
      
      if (data.content && data.content.length > 0) {
        setPosts(data.content);
        setHasMore(!data.last);
        setPage(1); // 다음 페이지를 위해 1로 설정
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setShowPostForm(false); // 폼 닫기
    }
  };

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/member/my`, {
          headers: authService.getAuthHeader(),
        });
        if (!response.ok) throw new Error('회원 정보를 가져오는데 실패했습니다.');
        const data = await response.json();
        setMemberInfo(data);
      } catch (error) {
        console.error('Error fetching member info:', error);
        setError('회원 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchMemberInfo();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      if (!authService.isAuthenticated()) {
        console.log("Authentication required");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/stories/followed`, {
          headers: authService.getAuthHeader(),
        });
        if (!response.ok) throw new Error('Failed to fetch stories');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="p-4">
      {/* Stories 섹션 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Stories</h2>
        <div className="flex overflow-x-auto space-x-4 py-2">
          <StoryProfile
            isMyStory={true}
            profileImage={memberInfo?.member?.profilePictureUrl}
            username="내 스토리"
            onPageChange={onPageChange}
          />

          {stories.length > 0 ? (
            stories.map((story) => (
              <StoryProfile
                key={story.id}
                isMyStory={false}
                profileImage={story.profilePictureUrl}
                username={story.memberName}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[80px]">
              <p className="text-xs text-gray-500">
                팔로우한 사용자의 스토리가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 최신 게시글 섹션 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">최신 게시글</h2>

        {/* 게시글 등록 버튼 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowPostForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-0"
          >
            +
          </button>
        </div>

        {/* PostForm 컴포넌트 */}
        {showPostForm && (
          <PostForm
            onPostSubmit={handlePostSubmitted}
            onClose={() => setShowPostForm(false)}
          />
        )}

        <InfiniteScroll
          dataLength={posts.length}
          next={() => {
            if (!loading) {
              setTimeout(fetchPosts, 500); // 500ms 지연 추가
            }
          }}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 p-4">
              새 게시글이 없습니다.
            </p>
          }
          scrollThreshold={0.8}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              memberId={post.memberId}
              memberName={post.memberName}
              content={post.content}
              mediaList={post.mediaList}
              createdAt={post.createdAt}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomePage;