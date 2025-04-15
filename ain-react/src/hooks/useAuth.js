import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // useAuth.js의 AuthProvider에 signup 추가 20250126
  const signup = async (userData) => {
    await authService.signup(userData);
  };

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token decode error:', error);
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // 일반 로그인 (이메일/비밀번호)
    if (credentials.email && credentials.password) {
      const token = await authService.login(credentials);
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
      setIsAuthenticated(true);
      return token;
    } 
    // OAuth 로그인 (토큰과 유저 정보가 이미 있는 경우)
    else if (credentials.token && credentials.userInfo) {
      // 토큰이 이미 localStorage에 저장되었다고 가정
      const userInfo = credentials.userInfo;
      
      // 현재 유저 정보 설정
      setCurrentUser({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        provider: userInfo.provider,
        // 추가 필요한 정보가 있으면 여기에 추가
      });
      
      setIsAuthenticated(true);
      return credentials.token;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser,
      loading, 
      login, 
      logout,
      signup 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};