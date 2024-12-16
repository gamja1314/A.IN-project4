import React from 'react';

const PostCard = ({ post }) => (
  <div className="post-card">
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
    {post.videoUrl && <video src={post.videoUrl} controls />}
  </div>
);

export default PostCard;
