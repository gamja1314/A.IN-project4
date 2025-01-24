import { Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import { authService } from '../../services/authService';

const PetRegistrationModal = ({ petInfo, isEditMode, onClose, onSubmit }) => {
  const [petData, setPetData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    age: '',
    photoUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (petInfo) {
      setPetData({
        name: petInfo.name || '',
        species: petInfo.species || '',
        breed: petInfo.breed || '',
        gender: petInfo.gender || '',
        age: petInfo.age || '',
        photoUrl: petInfo.photoUrl || ''
      });
      setImagePreview(petInfo.photoUrl);
    }
  }, [petInfo]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }
  
    try {
      setUploading(true);
  
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'pets');
  
      // S3 업로드
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader()
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '파일 업로드 실패');
      }
  
      const data = await response.json();
      
      // 미리보기 설정
      setImagePreview(URL.createObjectURL(file));
      
      // petData 업데이트
      setPetData(prev => ({
        ...prev,
        photoUrl: data.url
      }));
  
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || '파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        ...authService.getAuthHeader(),
        'Content-Type': 'application/json'
      };

      const endpoint = `${API_BASE_URL}/api/pet/my`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...petData,
          age: Number(petData.age)
        })
      });

      if (!response.ok) {
        throw new Error(isEditMode ? '반려동물 정보 수정 실패' : '반려동물 등록 실패');
      }

      onSubmit();
      onClose();
    } catch (error) {
      console.error('Pet registration/update error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? '반려동물 정보 수정' : '반려동물 등록'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* 반려동물 이미지 업로드 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">반려동물 사진</label>
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="pet-image"
                  disabled={uploading}
                />
                <label
                  htmlFor="pet-image"
                  className="cursor-pointer block w-full h-full"
                >
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Pet preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2">
                          {uploading ? '업로드 중...' : '사진 선택'}
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 입력 필드들 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">이름</label>
            <input
              type="text"
              name="name"
              value={petData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">종</label>
            <input
              type="text"
              name="species"
              value={petData.species}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">품종</label>
            <input
              type="text"
              name="breed"
              value={petData.breed}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">성별</label>
            <select
              name="gender"
              value={petData.gender}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">성별 선택</option>
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">나이</label>
            <input
              type="number"
              name="age"
              value={petData.age}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={uploading}
            >
              {uploading ? '업로드 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetRegistrationModal;