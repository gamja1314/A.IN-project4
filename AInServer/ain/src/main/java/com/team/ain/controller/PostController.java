package com.team.ain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.dto.post.Post;
import com.team.ain.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시물 생성
    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody Post post) {
        postService.createPost(post);
        return ResponseEntity.ok("게시물이 생성되었습니다.");
    }

    // 특정 게시물 조회
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // 활성화된 게시물 조회
    @GetMapping
    public ResponseEntity<List<Post>> getActivePosts() {
        List<Post> posts = postService.getActivePosts();
        return ResponseEntity.ok(posts);
    }

    // 게시물 수정
    @PutMapping
    public ResponseEntity<String> updatePost(@RequestBody Post updatedPost) {
        postService.updatePost(updatedPost);
        return ResponseEntity.ok("게시물이 수정되었습니다.");
    }

    // 게시물 상태 변경 (삭제 또는 비활성화)
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updatePostStatus(@PathVariable Long id, @RequestParam String status) {
        postService.updatePostStatus(id, status);
        return ResponseEntity.ok("게시물 상태가 변경되었습니다.");
    }
}