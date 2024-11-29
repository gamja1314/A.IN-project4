import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from "../../services/authService";

const MyPage = () => {
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const headers = {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json'
        };
        
        const response = await fetch(`${API_BASE_URL}/api/member/my`, {
          method: 'GET',
          headers
        });
        
        if (!response.ok) throw new Error('회원 정보를 가져오는 것을 실패했습니다.');
        const data = await response.json();
        setMemberInfo(data);
      } catch (err) {
        console.error("Error:", err);
        setError('회원 정보를 가져오는 것을 실패했습니다.');
      }
    };

    fetchMemberInfo();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await logout();
      authService.logout(); // authService의 logout 메서드도 호출
    } catch (error) {
      setError(error.message || '로그아웃에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={memberInfo?.member?.profile_picture_url || '/api/placeholder/80/80'} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{memberInfo?.member?.name || '사용자'}님</h2>
            <p className="text-sm text-gray-600">
              반려동물: {memberInfo?.pet ? memberInfo.pet.name : '등록된 반려동물이 없습니다'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <button disabled={loading} className="w-full p-2 text-left border rounded-lg hover:bg-gray-50">
            개인정보 수정
          </button>
          <button disabled={loading} className="w-full p-2 text-left border rounded-lg hover:bg-gray-50">
            구매관리
          </button>
          <button disabled={loading} className="w-full p-2 text-left border rounded-lg hover:bg-gray-50">
            피드관리
          </button>
          <button disabled={loading} className="w-full p-2 text-left border rounded-lg hover:bg-gray-50">
            친구관리
          </button>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className={`w-full p-2 text-left border rounded-lg hover:bg-gray-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;