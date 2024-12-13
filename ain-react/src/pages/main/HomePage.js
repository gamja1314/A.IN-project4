import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import { fetchPostsFromServer } from "../../services/PostService";
import { fetchFollowedStoriesFromServer } from "../../services/StoryService";
import axios from "axios"
import { authService } from '../../services/authService';

// Post
const Post = ({ title, content, createdAt }) => (
  <div className="border-b pb-4">
    <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
    <h3 className="text-sm font-bold">{title}</h3>
    <p className="text-sm">{content}</p>
    <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
  </div>
)

// Home Page
const HomePage = () => {
  const [posts, setPosts] = useState([]); //게시글 목록
  const [page, setPage] = useState(0); //현재 페이지 목록
  const [hasMore, setHasMore] = useState(true); //추가 데이터 여부
  const [stories, setStories] = useState([]); //스토리 데이터

  // localStorage에서 토큰 가져오기기
  useEffect(() => {
    
  }, []);

  //서버에서 게시글 로딩하기
  const fetchPosts = async () => {
    try{
      const size = 10;
      const response = await axios.get("/api/posts", { 
        params: { page, size},
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        }
      });
      const newPosts = response.data;

      if (newPosts.length ===0){
        setHasMore(false); //데이터가 없으면 중지
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]); //기존 데이터에 추가
        setPage((prevPage) => prevPage + 1); //다음페이지로 이동
      }
    } catch(error){
        console.error("게시글을 불러오는 중 오류 발생 : ", error);
        if(error.response?.status === 401){
          console.log("인증 필요, 로그인 페이지로 이동합니다.");
        }
    }
  };

  // 서버에서 스토리 로딩하기
  const fetchstories = async () => {
    try{
      const followdStories = await fetchFollowedStoriesFromServer();
      setStories(followdStories);
    } catch(error){
      console.error("스토리 데이터를 가져올 수 없음! : ", error);
    }
  }

  useEffect(() =>{
    fetchPosts(); //초기 데이터 로딩
  }, []);

    return (
      <div className="p-4">
        {/* 스토리 */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Stories</h2>
          <div className="flex overflow-x-auto space-x-4 py-2">
          {stories.length > 0 ? (
            stories.map((story) => (
              <story
                key={story.id}
                name={story.name}
                profileImage={story.profileImage}
              />
            ))
          ) : (
            <p className="text-xs text-gray-500">팔로우한 사용자의 스토리가 없습니다.</p>
          )}
        </div>
      </div>
            {/* <div className="flex-shrink-0 w-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full mb-1"></div>
              <p className="text-xs text-center">멍멍이</p>
            </div>
            <div className="flex-shrink-0 w-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full mb-1"></div>
              <p className="text-xs text-center">냥이</p>
            </div>
          </div>
        </div>  */}
        
        {/* 게시글 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">최신 게시글</h2>
          <InfiniteScroll
            dataLength={posts.length} //로드된 게시글 수
            next={fetchPosts} //다음 데이터 가져오기
            hasMore={hasMore} //추가데이터 여부
            loader={<h4>Loading...</h4>} //로딩중 메시지
            endMessage={<p style={{textAlign: "center"}}>새 게시글이 없습니다.</p>
            } //데이터로딩 끝 메시지
          >
              {posts.map((post)=>(
                <Post
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  createdAt={post.createdAt}
                  />
              ))}
          </InfiniteScroll>
        </div>
      </div>
    );
  };

export default HomePage;

  {/* <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">최신 게시글</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
              <p className="text-sm">우리 강아지 산책 나왔어요 🐕</p>
            </div>
          </div>
        </div> */}