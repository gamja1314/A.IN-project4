import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";

class PostServiceClass {
  // 게시글 생성
  async createPost(content, mediaUrl, mediaType) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          mediaUrl,
          mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error("게시물 작성에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  // 내 게시물 조회
  async getMyPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/my`, {
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("내 게시물을 불러오는데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching my posts:", error);
      throw error;
    }
  }

  // 특정 사용자의 게시물 조회
  async getUserPosts(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/user/${userId}`, {
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("사용자의 게시물을 불러오는데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }
  }

  // 게시물 삭제
  async deletePost(postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("게시물 삭제에 실패했습니다.");
      }

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const PostService = new PostServiceClass();
