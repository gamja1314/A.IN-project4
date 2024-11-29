package com.team.ain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.dto.ChatMessageDTO;
import com.team.ain.dto.ChatRoomDTO;
import com.team.ain.service.ChatService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;
    
    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createRoom(
            @RequestBody ChatRoomDTO roomDTO,
            HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
        roomDTO.setHostId(memberId);
        return ResponseEntity.ok(chatService.createRoom(roomDTO));
    }
    
    // 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getRooms(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
        return ResponseEntity.ok(chatService.getUserRooms(memberId));
    }
    
    // 채팅방 참여
    @PostMapping("/rooms/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable Long roomId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
        chatService.joinRoom(roomId, memberId);
        return ResponseEntity.ok().build();
    }
    
    // 메시지 전송 (WebSocket으로 구현하는 것이 더 적절)
    @MessageMapping("/chat/message")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO message) {
        return chatService.saveAndSendMessage(message);
    }
    
}