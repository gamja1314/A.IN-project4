import React from 'react';

const PostCard = ({ memberId, content, createdAt, mediaList }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border-b pb-4 mb-4">
      {/* 이미지 스크롤 컨테이너 */}
      {mediaList && mediaList.length > 0 && (
        <div className="relative mb-4">
          {/* 스크롤 가능한 이미지 컨테이너 */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {mediaList.map((media, index) => (
              <div 
                key={media.id} 
                className="flex-none w-full snap-center"
              >
                <img 
                  src={media.mediaUrl}
                  alt={`게시물 이미지 ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* 이미지 인디케이터 */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
              {mediaList.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-white opacity-60"
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 사용자 정보 */}
      <p className="text-sm font-medium mb-2">사용자 {memberId}</p>
      
      {/* 게시물 내용 */}
      <p className="text-sm mb-2">{content}</p>
      
      {/* 작성 시간 */}
      <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
    </div>
  );
};

export default PostCard;