import React from 'react';

const StoryPost = ({ title, content, createdAt }) => (
  <div className="border-b pb-4">
    <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
    <h3 className="text-sm font-bold">{title}</h3>
    <p className="text-sm">{content}</p>
    <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
  </div>
);

export default StoryPost;