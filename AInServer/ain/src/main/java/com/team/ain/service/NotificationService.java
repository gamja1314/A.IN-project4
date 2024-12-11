package com.team.ain.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.team.ain.dto.notice.NotificationDTO;
import com.team.ain.dto.notice.NotificationType;
import com.team.ain.mapper.ChatRoomMapper;
import com.team.ain.mapper.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomMapper chatRoomMapper;

    public void createMessageNotification(Long roomId, Long senderId, String content) {
        // 1. 채팅방의 모든 멤버 조회 (발신자 제외)
        List<Long> recipients = chatRoomMapper.findMembersByRoomId(roomId)
            .stream()
            .filter(memberId -> !memberId.equals(senderId))
            .collect(Collectors.toList());

        // 2. 각 수신자에게 알림 전송
        for (Long recipientId : recipients) {
            NotificationDTO notification = NotificationDTO.builder()
                .recipientId(recipientId)
                .senderId(senderId)
                .notificationType(NotificationType.NEW_MESSAGE)
                .content(content)
                .relatedId(roomId)
                .build();
            
            sendRealTimeNotification(recipientId, notification);
        }
    }

    // 읽지 않은 알림 조회
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationMapper.getUnreadNotifications(userId);
    }

    public void readRoomMessage(Long roomId, Long userId) {
        notificationMapper.markChatNotificationsAsRead(roomId, userId);
    }
    
    public void markAsRead(Long userId, List<Long> notificationIds) {
        notificationMapper.markNotificationsAsRead(userId, notificationIds);
    }

    public int getUnreadCount(Long userId) {
        return notificationMapper.getUnreadCount(userId);
    }

    private void sendRealTimeNotification(Long userId, NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notification
        );
    }
    
}
