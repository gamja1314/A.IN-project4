// src/services/ChatService.js
import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";

export const ChatService = {
  // 채팅방 생성
  createRoom: async (roomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      
      if (!response.ok) {
        throw new Error('채팅방 생성에 실패했습니다.');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  // 채팅방 목록 조회
  getRooms: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error('채팅방 목록을 불러오는데 실패했습니다.');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  },

  // 채팅방 참여하기
  joinRoom: async (roomId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/join`, {
            method: 'POST',
            headers: {
                ...authService.getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to join chat room');
        }

        return await response.json();
    } catch (error) {
        console.error('Join room error:', error);
        throw error;
    }
}
};