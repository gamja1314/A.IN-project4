package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team.ain.dto.post.Post;
import com.team.ain.mapper.PostMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    // 게시물 생성
    public void createPost(Post post) {
        postMapper.insertPost(post);
    }

    // 특정 게시물 조회
    public Post getPostById(Long id) {
        return postMapper.selectPostById(id);
    }

    // 활성화된 게시물 조회
    public List<Post> getActivePosts() {
        return postMapper.selectActivePosts();
    }

    // 게시물 수정
    @Transactional
    public void updatePost(Post updatedPost) {
        postMapper.updatePost(updatedPost);
    }

    // 게시물 상태 변경 (삭제 또는 비활성화)
    @Transactional
    public void updatePostStatus(Long id, String status) {
        postMapper.updatePostStatus(id, status);
    }
}
