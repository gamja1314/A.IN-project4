import React, { useState } from 'react';
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from "../../services/authService";
import { Upload } from 'lucide-react';

const PostForm = ({ onPostSubmit, onClose }) => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (!validTypes.includes(file.type)) {
      alert('이미지(JPEG, PNG, GIF) 또는 동영상(MP4) 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    try {
      setUploading(true);

      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'posts');

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
      setPreview(URL.createObjectURL(file));
      
      // 미디어 파일 정보 저장
      setMediaFile({
        url: data.url,
        type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'
      });

    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || '파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || !mediaFile) {
      alert("내용과 미디어 파일을 모두 입력해주세요.");
      return;
    }

    if (content.length > 255) {
      alert("내용은 255자를 초과할 수 없습니다.");
      return;
    }
    
    const postData = {
      content: content.trim(),
      mediaUrl: mediaFile.url,
      mediaType: mediaFile.type,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("게시글 등록 실패");

      // 폼 초기화
      setContent("");
      setMediaFile(null);
      setPreview(null);
      
      // 부모 컴포넌트에 알림
      onPostSubmit();
      onClose();
      
    } catch (error) {
      console.error("게시글 등록 중 오류 발생:", error);
      alert(error.message || "게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">새 게시글 작성</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              placeholder="게시글 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">미디어 파일</label>
            <div className="flex justify-center">
              <div className="relative w-full h-64">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*, video/mp4"
                  className="hidden"
                  id="media-file"
                  disabled={uploading}
                />
                <label
                  htmlFor="media-file"
                  className="cursor-pointer block w-full h-full"
                >
                  <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {preview ? (
                      mediaFile?.type === 'VIDEO' ? (
                        <video
                          src={preview}
                          controls
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2">
                          {uploading ? '업로드 중...' : '클릭하여 파일 선택'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          (이미지 또는 동영상)
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={uploading || !mediaFile}
            >
              {uploading ? '업로드 중...' : '게시하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;