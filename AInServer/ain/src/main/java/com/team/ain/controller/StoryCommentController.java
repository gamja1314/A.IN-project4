package com.team.ain.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.dto.story.StoryCommentDTO;
import com.team.ain.service.StoryCommentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryCommentController {

    private final StoryCommentService storyCommentService;
    private final JwtTokenProvider jwtTokenProvider;
    
    // 댓글 작성
    @PostMapping("/comments")
    public ResponseEntity<?> createComment(
            @RequestBody StoryCommentDTO commentDTO,
            HttpServletRequest request) {
        try {
            Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
            commentDTO.setMemberId(memberId);
            
            storyCommentService.createComment(commentDTO);
            log.info("댓글 작성 성공 - 스토리 ID: {}, 작성자 ID: {}", 
                commentDTO.getStoryId(), memberId);
                
            return ResponseEntity.ok(Map.of("message", "댓글이 작성되었습니다."));
        } catch (Exception e) {
            log.error("댓글 작성 실패: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // 스토리의 댓글 목록 조회
    @GetMapping("/{storyId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long storyId) {
        try {
            List<StoryCommentDTO> comments = storyCommentService.getCommentsByStoryId(storyId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("댓글 목록 조회 실패: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // 특정 댓글의 답글 조회
    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<?> getReplies(@PathVariable Long commentId) {
        try {
            List<StoryCommentDTO> replies = storyCommentService.getRepliesByCommentId(commentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            log.error("답글 목록 조회 실패: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            HttpServletRequest request) {
        try {
            Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
            storyCommentService.deleteComment(commentId, memberId);
            
            log.info("댓글 삭제 성공 - 댓글 ID: {}, 삭제자 ID: {}", commentId, memberId);
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
        } catch (Exception e) {
            log.error("댓글 삭제 실패: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}