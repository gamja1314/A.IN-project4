// package com.team.ain.controller;

// import java.util.List;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.ModelAttribute;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.team.ain.dto.post.Post;
// import com.team.ain.dto.post.PostRequest;
// import com.team.ain.service.PostService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/posts")
// @RequiredArgsConstructor
// public class PostController {

//     private final PostService postService;

//     // 게시물 생성
//     @PostMapping
//     public ResponseEntity<Post> createPost(@ModelAttribute PostRequest request) {
//         String username = getAuthenticatedUsername();
//         Post createdPost = postService.createPost(request, username);
//         return ResponseEntity.ok(createdPost);
//     }

//     // 게시물 조회
//     @GetMapping
//     public ResponseEntity<List<Post>> getPosts(@RequestParam int page, @RequestParam int size) {
//         List<Post> posts = postService.getPosts(page, size);
//         return ResponseEntity.ok(posts);
//     }

//     // 게시물 수정
//     @PutMapping("/{id}")
//     public ResponseEntity<Post> updatePost(@PathVariable Long id, @ModelAttribute PostRequest request) {
//         String username = getAuthenticatedUsername();
//         Post updatedPost = postService.updatePost(id, request, username);
//         return ResponseEntity.ok(updatedPost);
//     }

//     // 게시물 삭제
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deletePost(@PathVariable Long id) {
//         String username = getAuthenticatedUsername();
//         postService.deletePost(id, username);
//         return ResponseEntity.noContent().build();
//     }

//     // 인증된 사용자 이름 가져오기
//     private String getAuthenticatedUsername() {
//         Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//         if (principal instanceof UserDetails) {
//             return ((UserDetails) principal).getUsername();
//         } else {
//             return principal.toString();
//         }
//     }
// }
package com.team.ain.controller;

import com.team.ain.dto.post.Post;
import com.team.ain.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    // 게시물 생성
    @PostMapping
    public ResponseEntity<Void> createPost(@RequestBody Post post) {
        postService.createPost(post);
        return ResponseEntity.ok().build();
    }

    // 게시물 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // 게시물 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody Post post) {
        post.setId(id);
        postService.updatePost(post);
        return ResponseEntity.ok().build();
    }

    // 게시물 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 목록 조회 (페이지네이션)
    @GetMapping
    public ResponseEntity<List<Post>> getPosts(@RequestParam int page, @RequestParam int size) {
        List<Post> posts = postService.getPosts(page, size);
        return ResponseEntity.ok(posts);
        
    }
}
