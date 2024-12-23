package com.team.ain.dto.post;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class Post {
    private Long id;
    private Long memberId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PostMedia> mediaList; // 추가된 부분
}