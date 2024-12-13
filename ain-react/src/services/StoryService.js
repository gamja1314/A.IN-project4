import axios from "axios";

/**
 * @returns {Promise<Array>} - 팔로우한 사용자들의 스토리 배열
 */
export const fetchFollowedStoriesFromServer = async () => {
  try {
    const response = await axios.get("/api/story/followed");
    return response.data; // 서버로부터 반환된 데이터
  } catch (error) {
    console.error("스토리 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};
