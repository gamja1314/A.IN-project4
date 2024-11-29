package com.team.ain.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatRoomDTO {
    private Long id;
    private String roomName;
    private boolean roomType;  // true: 오픈채팅, false: 1:1채팅
    private Long hostId;
    private LocalDateTime createdAt;
    private boolean isActive;
}