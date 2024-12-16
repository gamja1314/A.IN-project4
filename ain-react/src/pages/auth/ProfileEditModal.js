import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import { authService } from '../../services/authService';

const ProfileEditModal = ({ memberInfo, onClose, onUpdate }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    profilePictureUrl: ''
  });

  useEffect(() => {
    // 기존 회원 정보로 초기화
    if (memberInfo) {
      setProfileData({
        name: memberInfo.name || '',
        phoneNumber: memberInfo.phoneNumber || '',
        password: '',
        confirmPassword: '',
        profilePictureUrl: memberInfo.profilePictureUrl || ''
      });
    }
  }, [memberInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (profileData.password !== profileData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const headers = {
        ...authService.getAuthHeader(),
        'Content-Type': 'application/json'
      };

      const updateData = {
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
        password: profileData.password || undefined,
        profilePictureUrl: profileData.profilePictureUrl
      };

      const response = await fetch(`${API_BASE_URL}/api/member/update`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '프로필 업데이트에 실패했습니다.');
      }

      // 성공 시 부모 컴포넌트에 알림
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">프로필 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">프로필 사진 URL</label>
            <input
              type="text"
              name="profilePictureUrl"
              value={profileData.profilePictureUrl}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="프로필 사진 URL"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">이름</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="이름"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">전화번호</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="전화번호"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">새 비밀번호 (선택)</label>
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="새 비밀번호 (변경 원치 않으면 공백)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={profileData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="비밀번호 확인"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;