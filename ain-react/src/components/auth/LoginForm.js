// components/auth/LoginForm.js
import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API 호출 로직
      console.log('로그인 시도:', formData);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            로그인 상태 유지
          </label>
        </div>

        <div className="text-sm">
          <button 
            onClick={() => {/* 비밀번호 찾기 처리 */}} 
            className="font-medium text-blue-600 hover:text-blue-500">
            비밀번호 찾기
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          로그인
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">계정이 없으신가요?</span>
        <a href="/signup" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
          회원가입
        </a>
      </div>
    </form>
  );
};

export default LoginForm;