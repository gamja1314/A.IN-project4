package com.team.ain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<String> createPost(
        @RequestPart("post") Post post,
        @RequestPart(value = "file", required = false) MultipartFile file) {
        postService.createPost(post, file);
        return ResponseEntity.ok("게시물이 생성되었습니다.");
    }

    // 게시물 수정
    @PutMapping
    public ResponseEntity<String> updatePost(
        @PathVariable Long id,
        @RequestPart("post") Post post,
        @RequestPart(value= "file", required = false) MultipartFile file) {
        postService.updatePost(id, post, file);
        return ResponseEntity.ok("게시물이 수정되었습니다.");
    }

    // 활성화된 게시물 조회
    @GetMapping
    public ResponseEntity<List<Post>> getPosts(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {
       List<Post> posts = postService.getActivePosts(page,size);
        return ResponseEntity.ok(posts);
    }

   // 특정 게시물 조회
   @GetMapping("/{id}")
   public ResponseEntity<Post> getPostById(@PathVariable Long id) {
       Post post = postService.getPostById(id);
       return ResponseEntity.ok(post);
   }

    // 게시물 비활성화
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updatePostStatus(@PathVariable Long id, @RequestParam String status) {
        postService.updatePostStatus(id, status);
        return ResponseEntity.ok("게시물이 비활성화되었습니다.");
    }

    // 게시물 완전삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id){
        postService.deletePost(id);
        return ResponseEntity.ok("게시물이 삭제되었습니다.");
    }
}