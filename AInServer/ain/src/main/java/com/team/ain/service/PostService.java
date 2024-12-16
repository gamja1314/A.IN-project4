package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team.ain.dto.post.Post;
import com.team.ain.dto.post.PostRequest;
import com.team.ain.mapper.PostMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;
    private final S3Service s3Service;

    public Post createPost(PostRequest request, String username) {
        String imageUrl = request.getImage() != null ? s3Service.uploadFile(request.getImage()) : null;
        String videoUrl = request.getVideo() != null ? s3Service.uploadFile(request.getVideo()) : null;

        Post post = new Post(null, request.getTitle(), request.getContent(), imageUrl, videoUrl, username, null, null);
        postMapper.insertPost(post);

        return post;
    }

    public List<Post> getPosts(int page, int size) {
        int offset = (page - 1) * size;
        return postMapper.selectAllPosts(offset, size);
    }

    public Post updatePost(Long id, PostRequest request, String username) {
        Post existingPost = postMapper.selectPostById(id);
        if (existingPost == null || !existingPost.getUsername().equals(username)) {
            throw new RuntimeException("Post not found or unauthorized");
        }

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        postMapper.updatePost(existingPost);

        return existingPost;
    }

    public void deletePost(Long id, String username) {
        Post existingPost = postMapper.selectPostById(id);
        if (existingPost == null || !existingPost.getUsername().equals(username)) {
            throw new RuntimeException("Post not found or unauthorized");
        }

        postMapper.deletePost(id);
    }
}
