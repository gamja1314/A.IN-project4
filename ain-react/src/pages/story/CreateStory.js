import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth'; 

const CreateStory = ({ onPageChange }) => {
  const { isAuthenticated } = useAuth(); 
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      onPageChange('login');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/stories`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
  
      if (!response.ok) {
        throw new Error('스토리 작성에 실패했습니다.');
      }
      
      onPageChange('myStories');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-[1000] max-w-md mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => onPageChange('home')} 
            className="text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">스토리 만들기</h1>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className={`px-4 py-1 rounded-full ${
              loading || !content.trim()
                ? 'bg-blue-200 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {loading ? '게시 중...' : '게시'}
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="pt-16 px-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <textarea
          className="w-full h-[calc(100vh-8rem)] p-4 border-none resize-none focus:ring-0 focus:outline-none"
          placeholder="스토리를 작성해보세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          autoFocus
        />
      </div>
    </div>
  );
};

export default CreateStory;