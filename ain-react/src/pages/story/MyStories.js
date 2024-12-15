import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from '../../services/authService';

const MyStories = ({ onPageChange }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stories/my`, {
          headers: authService.getAuthHeader(),
        });

        if (!response.ok) {
          throw new Error('스토리를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStories();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={() => onPageChange('home')} 
            className="text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold ml-4">내 스토리</h1>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="pt-16 px-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>로딩 중...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500">작성한 스토리가 없습니다.</p>
            <button
              onClick={() => onPageChange('createStory')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full"
            >
              스토리 작성하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={story.profilePictureUrl || '/api/placeholder/40/40'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{story.memberName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(story.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800">{story.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStories;