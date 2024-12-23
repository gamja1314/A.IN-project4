package com.team.ain.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.team.ain.dto.post.Post;
import com.team.ain.mapper.PostMapper;

@Service
public class PostService {

    private final PostMapper postMapper;

    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    // 게시물 생성
    public void createPost(Post post) {
        postMapper.insertPost(post);
    }

    // 게시물 단일 조회
    public Post getPostById(int id) {
        return postMapper.getPostById(id);
    }

    // 게시물 전체 조회
    public List<Post> getAllPosts() {
        return postMapper.getAllPosts();
    }

    // 게시물 수정
    public void updatePost(Post post) {
        postMapper.updatePost(post);
    }

    // 게시물 삭제
    public void deletePostById(int id) {
        postMapper.deletePostById(id);
    }

    // 페이지 계산
    public Page<Post> getPostsByPage(int page, int size) {
        // 유효성 검사
        if (page < 0) page = 0;
        if (size < 1) size = 10;

        // 전체 게시물 수 조회
        int totalPosts = postMapper.getTotalPostCount();
        
        // 페이지 정보 계산
        int offset = page * size;
        List<Post> posts = postMapper.getPostsByPage(page, size);
        
        return new PageImpl<>(posts, PageRequest.of(page, size), totalPosts);
    }
}
