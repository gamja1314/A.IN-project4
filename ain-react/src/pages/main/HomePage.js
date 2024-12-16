// import React, { useState, useEffect } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { API_BASE_URL } from "../../config/apiConfig";
// import { authService } from "../../services/authService";
// import StoryProfile from '../story/StoryProfile';
// import StoryPost from "../story/StoryPost";

// const HomePage = ({ onPageChange }) => {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [stories, setStories] = useState([]);
//   const [memberInfo, setMemberInfo] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
//   const [newPostContent, setNewPostContent] = useState(""); // 새 게시물 내용

//   // 회원 정보 가져오기
//   useEffect(() => {
//     const fetchMemberInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/member/my`, {
//           headers: authService.getAuthHeader(),
//         });
//         if (!response.ok) throw new Error('Failed to fetch member info');
//         const data = await response.json();
//         setMemberInfo(data);
//       } catch (error) {
//         console.error('Error fetching member info:', error);
//       }
//     };

//     fetchMemberInfo();
//   }, []);

//   // 스토리 데이터 가져오기
//   useEffect(() => {
//     const fetchStories = async () => {
//       if (!authService.isAuthenticated()) {
//         console.log("Authentication required");
//         return;
//       }
    
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/stories/followed`, { 
//           headers: authService.getAuthHeader(),
//         });
//         if (!response.ok) throw new Error('Failed to fetch stories');
//         const data = await response.json();
//         setStories(data);
//       } catch (error) {
//         console.error('Error fetching stories:', error);
//       }
//     };

//     fetchStories();
//   }, []);

//   // 게시물 가져오기
//   const fetchPosts = async () => {
//     try {
//       const size = 10;
//       const response = await fetch(`${API_BASE_URL}/api/posts/page?page=${page}&size=${size}`, {
//         method: "GET",
//         headers: {
//           ...authService.getAuthHeader(),
//           "Content-Type": "application/json",
//         },
//       });
      
//       if (!response.ok) throw new Error("게시물 데이터를 가져오는데 실패했습니다.");
      
//       const newPosts = await response.json();
//       if (newPosts.length < size) {
//         setHasMore(false);
//       }
//       setPosts((prevPosts) => [...prevPosts, ...newPosts]);
//       setPage((prevPage) => prevPage + 1);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     }
//   };

//   // 초기 데이터 로딩
//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // 게시물 생성 핸들러
//   const handleCreatePost = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/posts`, {
//       method: "POST",
//       headers: {
//         ...authService.getAuthHeader(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: newPostContent }),
//     });

//     if (!response.ok) throw new Error("게시물 생성에 실패했습니다.");
//     setIsModalOpen(false);
//     setNewPostContent(""); // 입력값 초기화
//     setPage(1); // 페이지 초기화
//     setPosts([]); // 기존 게시물 리셋
//     fetchPosts(); // 새 게시물 불러오기
//   } catch (error) {
//     console.error("Error creating post:", error.message);
//   }
// };

//   return (
//     <div className="p-4">
//       {/* Stories 섹션 */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4">
//         <h2 className="text-lg font-semibold mb-2">Stories</h2>
//         <div className="flex overflow-x-auto space-x-4 py-2">
//           {/* 내 스토리 프로필 */}
//           <StoryProfile
//             isMyStory={true}
//             profileImage={memberInfo?.member?.profile_picture_url}
//             username="내 스토리"
//             onPageChange={onPageChange}
//           />
          
//           {stories.length > 0 ? (
//             // 팔로우한 유저들의 스토리
//             stories.map((story) => (
//               <StoryProfile
//                 key={story.id}
//                 isMyStory={false}
//                 profileImage={story.profilePictureUrl}
//                 username={story.memberName}
//               />
//             ))
//           ) : (
//             // 팔로우한 유저들의 스토리가 없을 때
//             <div className="flex-1 flex items-center justify-center min-h-[80px]">
//               <p className="text-xs text-gray-500">
//                 팔로우한 사용자의 스토리가 없습니다.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* 게시물 생성 버튼 */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">게시물</h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           게시물 생성
//         </button>
//       </div>
      
//         {/* 게시물 생성 모달 */}
//         {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow-md">
//             <h2 className="text-lg font-semibold mb-4">게시물 생성</h2>
//             <textarea
//               className="w-full p-2 border rounded mb-4"
//               rows="4"
//               value={newPostContent}
//               onChange={(e) => setNewPostContent(e.target.value)}
//               placeholder="게시물 내용을 입력하세요"
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 취소
//               </button>
//               <button
//                 onClick={handleCreatePost}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 게시물 등록
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 최신 게시글 섹션 */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h2 className="text-lg font-semibold mb-2">최신 게시글</h2>
//         <InfiniteScroll
//           dataLength={posts.length}
//           next={fetchPosts}
//           hasMore={hasMore}
//           loader={<h4>Loading...</h4>}
//           endMessage={<p style={{ textAlign: "center" }}>새 게시글이 없습니다.</p>}
//         >
//           {posts.map((post) => (
//             <StoryPost
//               key={post.id}
//               title={post.title || "제목 없음"}
//               content={post.content || "내용 없음"}
//               createdAt={new Date(post.createdAt).toLocaleDateString()}
//             />
//           ))}
//         </InfiniteScroll>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from "../../services/authService";
import StoryProfile from '../story/StoryProfile';
import StoryPost from "../story/StoryPost";

const HomePage = ({ onPageChange }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stories, setStories] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(false);

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
          {/* 내 스토리 프로필 */}
          <StoryProfile
            isMyStory={true}
            profileImage={memberInfo?.member?.profile_picture_url}
            username="내 스토리"
            onPageChange={onPageChange}
          />
          
          {stories.length > 0 ? (
            // 팔로우한 유저들의 스토리
            stories.map((story) => (
              <StoryProfile
                key={story.id}
                isMyStory={false}
                profileImage={story.profilePictureUrl}
                username={story.memberName}
              />
            ))
          ) : (
            // 팔로우한 유저들의 스토리가 없을 때
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
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: "center" }}>새 게시글이 없습니다.</p>}
          scrollThreshold={0.8} // 스크롤 임계값 설정
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