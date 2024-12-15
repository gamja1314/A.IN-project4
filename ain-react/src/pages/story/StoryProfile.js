import React from 'react';
import { Plus } from 'lucide-react';

const StoryProfile = ({ isMyStory, profileImage, username, onPageChange }) => {
  return (
    <div className="flex-shrink-0 w-20 flex flex-col items-center">
      <div className="relative mb-1">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={profileImage || '/api/placeholder/64/64'} 
            alt={username} 
            className="w-full h-full object-cover"
          />
        </div>
        {isMyStory && (
          <button
            onClick={() => onPageChange('createStory')}
            className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
          >
            <Plus size={14} className="text-white" />
          </button>
        )}
      </div>
      <span className="text-xs text-center truncate w-full">
        {isMyStory ? '내 스토리' : username}
      </span>
    </div>
  );
};

export default StoryProfile;