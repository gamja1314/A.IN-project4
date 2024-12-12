package com.team.ain.dto.post;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Post {
    private Long id; // 게시물 ID
    private Long memberId; // 작성자 ID
    private String content; // 게시물 내용
    private String status; // 게시물 상태 ("ACTIVE" 또는 "DELETED")
    private String location; // 위치 정보
    private String mediaUrl; // 미디어 파일 URL
    private String mediaType; // 미디어 타입 (img / video)
    private String createdAt; // 생성 시간
    private String updatedAt; // 마지막 수정 시간
}
