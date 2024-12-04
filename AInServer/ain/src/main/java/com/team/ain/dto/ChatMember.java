package com.team.ain.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMember {
    private Long roomId;

    private Long memberId;

    private LocalDateTime joinedAt;

    private LocalDateTime lastReadAt;
}