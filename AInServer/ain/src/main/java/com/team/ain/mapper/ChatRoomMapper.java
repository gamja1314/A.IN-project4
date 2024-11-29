package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.ChatRoomDTO;

@Mapper
public interface ChatRoomMapper {
    void insertRoom(ChatRoomDTO room);
    void addRoomMember(Long roomId, Long userId);
    List<ChatRoomDTO> findRoomsByUserId(Long userId);
    boolean isRoomMember(Long roomId, Long userId);
}