package com.team.ain.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
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
import com.team.ain.service.NotificationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;
    private final NotificationService notificationService;
    private final SimpMessageSendingOperations messagingTemplate;
    
    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createRoom(
            @RequestBody ChatRoomDTO roomDTO,
            HttpServletRequest request) {
        Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
        roomDTO.setHostId(memberId);
        ChatRoomDTO createdRoom = chatService.createRoom(roomDTO);
        return ResponseEntity.ok(createdRoom);
    }
    
    // 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getRooms(HttpServletRequest request) {
        Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
        List<ChatRoomDTO> rooms = chatService.getUserRooms(memberId);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/search")
    public ResponseEntity<?> searchRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("keyword : " + keyword + "page : " + page + "size : " + size);
        try {
            Page<ChatRoomDTO> rooms = chatService.searchRooms(keyword, PageRequest.of(page, size));
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("채팅방 검색 중 오류가 발생했습니다.");
        }
    }
    
    // WebSocket을 통한 채팅 메시지 처리
    @MessageMapping("/chat/message")
    public void handleChatMessage(@Payload ChatMessageDTO message) {
        // 메시지 저장
        ChatMessageDTO savedMessage = chatService.saveAndSendMessage(message);
        notificationService.createMessageNotification(message.getRoomId(), message.getSenderId(), message.getContent());
        // WebSocket을 통해 구독자들에게 메시지 전송
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), savedMessage);
    }
    
    @PostMapping("/rooms/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable Long roomId, HttpServletRequest request) {
        try {
            // 현재 사용자 ID 가져오기
            Long userId = jwtTokenProvider.getMemberIdFromRequest(request);

            // 서비스를 통해 채팅방 참여 처리
            chatService.joinRoom(roomId, userId);

            // 채팅방 정보 조회
            ChatRoomDTO room = chatService.getRoomById(roomId);
            
            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("roomId", room.getId());
            response.put("roomName", room.getRoomName());
            response.put("joinedAt", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(("Failed to join chat room: " + e.getMessage()));
        }
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(
            @PathVariable Long roomId, HttpServletRequest request) {
        Long userId = jwtTokenProvider.getMemberIdFromRequest(request);
        List<ChatMessageDTO> messages = chatService.getRoomMessages(roomId, userId);
        notificationService.readRoomMessage(roomId, userId);
        return ResponseEntity.ok(messages);
    }
    
    
    // 채팅방의 이전 메시지 조회 (선택적 기능)
    // @GetMapping("/rooms/{roomId}/messages")
    // public ResponseEntity<List<ChatMessageDTO>> getRoomMessages(
    //         @PathVariable Long roomId,
    //         HttpServletRequest request) {
    //     Long memberId = jwtTokenProvider.getMemberIdFromRequest(request);
    //     // 메시지 조회 로직 구현 필요
    //     return ResponseEntity.ok().build();
    // }
}