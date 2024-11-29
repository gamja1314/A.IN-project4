package com.team.ain.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Long id;
    private Long roomId;
    private Long senderId;
    private String messageType;  // TEXT, IMAGE, FILE
    private String content;
    private LocalDateTime createdAt;
    private boolean isDeleted;
    private String fileUrl;
    private String fileName;
    private Integer fileSize;
}