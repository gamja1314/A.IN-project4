import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";

class StoryCommentServiceClass {
  // 댓글 작성
  async createComment(storyId, content, parentId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stories/comments`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId,
          content,
          parentId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '댓글 작성에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // 스토리의 댓글 목록 조회
  async getComments(storyId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/comments`,
        {
          headers: authService.getAuthHeader()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '댓글을 불러오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // 특정 댓글의 답글 조회
  async getReplies(commentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stories/comments/${commentId}/replies`,
        {
          headers: authService.getAuthHeader()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '답글을 불러오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }

  // 댓글 삭제
  async deleteComment(commentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stories/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: authService.getAuthHeader()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '댓글 삭제에 실패했습니다.');
      }

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export const storyCommentService = new StoryCommentServiceClass();