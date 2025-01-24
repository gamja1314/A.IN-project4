import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = ({ onPageChange }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    // 추가 유효성 검사 (이메일 형식, 비밀번호 강도 등)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber
      });

      // MODIFY: After successful signup, you might want to navigate to a specific page
      // For example, redirecting to login or home page
      onPageChange && onPageChange('login');
    } catch (error) {
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-2 text-red-500 text-sm text-center bg-red-100 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="비밀번호 (최소 8자)"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="name" className="sr-only">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="sr-only">전화번호</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="전화번호 (- 제외)"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? '회원가입 중...' : '회원가입'}
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">이미 계정이 있으신가요?</span>
        {/* MODIFY: Use onPageChange to switch to login page */}
        <button 
          type="button" 
          onClick={() => onPageChange && onPageChange('login')} 
          className="ml-1 font-medium text-blue-600 hover:text-blue-500"
        >
          로그인
        </button>
      </div>
    </form>
  );
};

export default SignupForm;