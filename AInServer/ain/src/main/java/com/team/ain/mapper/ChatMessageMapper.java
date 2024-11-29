package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.ChatMessageDTO;

@Mapper
public interface ChatMessageMapper {
    void insertMessage(ChatMessageDTO message);
    List<ChatMessageDTO> findMessagesByRoomId(Long roomId);
}