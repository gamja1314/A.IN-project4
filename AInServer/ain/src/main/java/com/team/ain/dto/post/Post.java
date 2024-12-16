package com.team.ain.dto.post;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
public class Post {
    private Long id;                 // 게시글 ID
    private Long memberId;           // 작성자 ID
    private String content;          // 게시글 내용
    private String mediaUrl;         // 미디어 URL (이미지/영상)
    private String mediaType;        // 미디어 타입 ("IMAGE", "VIDEO")
    private String location;         // 위치 정보
    private LocalDateTime createdAt; // 생성 시간
    private LocalDateTime updatedAt; // 수정 시간
    private String status;           // 상태 ("ACTIVE", "DELETED")
}
