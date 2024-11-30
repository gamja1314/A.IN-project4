package com.team.ain.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRoomMember {
    private Long id;

    private Long roomId;

    private Long memberId;

    private LocalDateTime joinedAt;

    private LocalDateTime lastReadAt;
}