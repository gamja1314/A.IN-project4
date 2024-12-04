package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.team.ain.dto.ChatMember;
import com.team.ain.dto.ChatRoomDTO;

@Mapper
public interface ChatRoomMapper {
    // 기존 메서드들 유지
    void insertRoom(ChatRoomDTO room);
    void addRoomMember(Long roomId, Long userId);
    List<ChatRoomDTO> findRoomsByUserId(Long userId);
    boolean isRoomMember(Long roomId, Long userId);
    ChatRoomDTO findRoomById(Long romeId);
    void readChatRoom(ChatMember chatMember);
    void leaveChatRoom(ChatMember chatMember);
    
    // 페이징 관련 메서드들의 파라미터 타입을 명확하게 지정
    List<ChatRoomDTO> findByRoomNameContainingIgnoreCaseAndIsActiveTrue(
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );
    
    List<ChatRoomDTO> findAllByIsActiveTrue(
        @Param("offset") int offset,
        @Param("size") int size
    );
    
    long countByRoomNameContainingIgnoreCaseAndIsActiveTrue(@Param("keyword") String keyword);
    long countAllByIsActiveTrue();
}