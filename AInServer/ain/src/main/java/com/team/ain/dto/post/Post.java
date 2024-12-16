package com.team.ain.dto.post;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Post {
    private Long id;          // 게시물 ID
    private String title;     // 게시물 제목
    private String content;   // 게시물 내용
    private String imageUrl;  // 이미지 URL
    private String videoUrl;  // 동영상 URL
    private String username;  // 작성자 이름
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
