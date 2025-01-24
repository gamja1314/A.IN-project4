import React from 'react';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage = ({ onPageChange }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            애니멀 인사이드와 함께해요
          </p>
        </div>

        {/* MODIFY: Pass onPageChange to SignupForm */}
        <SignupForm onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default SignupPage;