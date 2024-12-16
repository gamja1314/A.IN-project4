package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;

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

    // 게시물 단일 조회
    public Post getPostById(Long id) {
        return postMapper.findPostById(id);
    }

    // 게시물 수정
    public void updatePost(Post post) {
        postMapper.updatePost(post);
    }

    // 게시물 삭제
    public void deletePost(Long id) {
        postMapper.deletePost(id);
    }

    // 게시물 목록 조회 (페이지네이션)
    public List<Post> getPosts(int page, int size) {
        int offset = (page - 1) * size; // 페이지네이션 계산
        return postMapper.findPosts(offset, size);
    }
}
