import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from "../../services/authService";
import StoryProfile from '../story/StoryProfile';
import StoryPost from "../story/StoryPost";

const HomePage = ({ onPageChange }) => {
  const [posts, setPosts] = useState([]); // 게시글 목록
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const [stories, setStories] = useState([]); // 스토리 목록
  const [memberInfo, setMemberInfo] = useState(null); // 사용자 정보
  const [loading, setLoading] = useState(false); // 게시글 로딩 상태
  const [showPostForm, setShowPostForm] = useState(false); // 팝업 상태
  const [content, setContent] = useState(""); // 게시글 내용
  const [mediaUrl, setMediaUrl] = useState(""); // 미디어 URL

  const limit = 10;

  // 회원 정보 가져오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/member/my`, {
          headers: authService.getAuthHeader(),
        });
        if (!response.ok) throw new Error('Failed to fetch member info');
        const data = await response.json();
        setMemberInfo(data);
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };

    fetchMemberInfo();
  }, []);

  // 스토리 데이터 가져오기
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

  // 게시글 가져오기
  const fetchPosts = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const size = 10;
      const response = await fetch(`${API_BASE_URL}/api/posts/page?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("게시물 데이터를 가져오는데 실패했습니다.");

      const newPosts = await response.json();

      // 중복 제거를 위해 Set 사용
      const uniquePosts = [...new Set([...posts, ...newPosts].map(JSON.stringify))].map(JSON.parse);

      // 새 게시글이 없거나 마지막 페이지인 경우
      if (newPosts.length < size) {
        setHasMore(false);
      }

      setPosts(uniquePosts);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 등록
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (content.length > 255 || mediaUrl.length > 255) {
      alert("내용과 URL은 255자를 초과할 수 없습니다.");
      return;
    }
    
    const postData = {
      content,
      mediaUrl,
      mediaType: mediaUrl.endsWith(".mp4") ? "VIDEO" : "IMAGE",
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("게시글 등록 실패");

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]); // 새 게시글 추가
      setContent("");
      setMediaUrl("");
      setShowPostForm(false); // 팝업 닫기
    } catch (error) {
      console.error("게시글 등록 중 오류 발생:", error);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      

      {/* Stories 섹션 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Stories</h2>
        <div className="flex overflow-x-auto space-x-4 py-2">
          <StoryProfile
            isMyStory={true}
            profileImage={memberInfo?.member?.profile_picture_url}
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

       {/* 게시글 등록 폼 (팝업) */}
       {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">게시글 등록</h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                placeholder="게시글 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="파일URL(사진 또는 영상)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                required
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
           )}

        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: "center" }}>새 게시글이 없습니다.</p>}
          scrollThreshold={0.8}
        >
          {posts.map((post) => (
            <StoryPost
              key={post.id}
              title={post.title || "제목 없음"}
              content={post.content || "내용 없음"}
              createdAt={new Date(post.createdAt).toLocaleDateString()}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomePage;
