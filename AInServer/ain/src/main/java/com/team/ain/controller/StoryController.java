package com.team.ain.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.dto.story.StoryDTO;
import com.team.ain.dto.story.StoryRequest;
import com.team.ain.service.StoryService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {
    private final StoryService storyService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ResponseEntity<?> createStory(
            @RequestBody StoryRequest content, HttpServletRequest request) {
            
            Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
            StoryDTO storyDTO = new StoryDTO();
            storyDTO.setMemberId(memberId);
            storyDTO.setContent(content.getContent());
            
            storyService.createStory(storyDTO);
            return ResponseEntity.ok().body("스토리가 성공적으로 작성되었습니다.");
            
    }

    @GetMapping
    public ResponseEntity<?> getAllStories(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            // 토큰 유효성 검증
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<StoryDTO> stories = storyService.getAllActiveStories();
            return ResponseEntity.ok(stories);
            
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("스토리 목록을 가져오는데 실패했습니다.");
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyStories(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
            
            List<StoryDTO> stories = storyService.getRecentMemberStories(memberId);
            return ResponseEntity.ok(stories);
            
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("내 스토리를 조회할 권한이 없습니다.");
        }
    }

    @GetMapping("/user/{memberId}")
    public ResponseEntity<?> getMemberStories(
            @PathVariable Long memberId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            // 토큰 유효성 검증
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<StoryDTO> stories = storyService.getMemberStories(memberId);
            return ResponseEntity.ok(stories);
            
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("사용자의 스토리 목록을 가져오는데 실패했습니다.");
        }
    }
}