import axiosInstance from "../utils/axiosInstance";

export const fetchPosts = async (page, size) => {
  try {
    const response = await axiosInstance.get("/api/post/page", {
      params: { page, size }, // 페이지네이션 파라미터
    });
    return response.data;
  } catch (error) {
    console.error("게시물 로딩 오류:", error);
    throw error;
  }
};
