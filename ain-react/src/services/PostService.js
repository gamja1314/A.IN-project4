import apiClient from './apiClient';

export const fetchPosts = async (page, size) => {
  const response = await apiClient.get('/api/posts', {
    params: { page, size },
  });
  return response.data;
};
