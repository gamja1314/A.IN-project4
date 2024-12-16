import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";

export const PostService = {
  async fetchPosts(page, size) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/page?page=${page}&size=${size}`, {
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },
};
