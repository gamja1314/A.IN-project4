package com.team.ain.dto.post;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private MultipartFile image;
    private MultipartFile video;
}
