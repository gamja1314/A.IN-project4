package com.team.ain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.dto.post.Post;
import com.team.ain.service.PostService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final JwtTokenProvider jwtTokenProvider;

    // 게시물 생성
    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody Post post, HttpServletRequest request) {
        Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
        post.setMemberId(memberId);
        // 미디어가 이미지인지 비디오인지 검증하는 거 필요함
        post.setMediaType("image");
        postService.createPost(post);
        return ResponseEntity.ok("게시물이 성공적으로 생성되었습니다.");
    }

    // 게시물 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable("id") int id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // 게시물 전체 조회
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // 페이징된 게시물 조회
    @GetMapping("/page")
    public ResponseEntity<List<Post>> getPostsByPage(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "10") int size) {
        List<Post> posts = postService.getPostsByPage(page, size);
        return ResponseEntity.ok(posts);
    }

    // 게시물 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable("id") Long id, @RequestBody Post post) {
        post.setId(id); // 수정할 게시물 ID 설정
        postService.updatePost(post);
        return ResponseEntity.ok("게시물이 성공적으로 수정되었습니다.");
    }

    // 게시물 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable("id") int id) {
        postService.deletePostById(id);
        return ResponseEntity.ok("게시물이 성공적으로 삭제되었습니다.");
    }
}
