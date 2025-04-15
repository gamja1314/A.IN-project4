import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { MobileLayout } from '../../components/layout/MobileLayout';

const OAuthCallback = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const processOAuthRedirect = async () => {
      try {
        // URL에서 쿼리 파라미터 추출
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const encodedName = params.get('name');
        const encodedEmail = params.get('email');
        const encodedProvider = params.get('provider');
  
        if (!token) {
          throw new Error('인증 토큰을 받지 못했습니다.');
        }

        // URL 디코딩 수행
        const name = encodedName ? decodeURIComponent(encodedName) : '';
        const email = encodedEmail ? decodeURIComponent(encodedEmail) : '';
        const provider = encodedProvider ? decodeURIComponent(encodedProvider) : '';
  
        // 토큰 저장
        authService.handleOAuthToken(token);
  
        // 인증 상태 업데이트
        if (login && typeof login === 'function') {
          await login({
            token,
            userInfo: {
              id: userId,
              name,
              email,
              provider
            }
          });
        }
  
        // 메인 페이지로 리다이렉트
        navigate('/', { replace: true });
      } catch (err) {
        console.error('OAuth 처리 중 오류 발생:', err);
        setError(err.message || '소셜 로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
  
    processOAuthRedirect();
  }, [location, navigate, login]);

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">로그인 처리 중...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-center">
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                로그인 페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return null;
}

export default OAuthCallback;