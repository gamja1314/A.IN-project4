import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class ChatServiceClass {
  constructor() {
    this.client = null;
  }

  // 채팅방 생성
  async createRoom(roomData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: roomData.roomName,
          description: roomData.description,
          roomType: roomData.roomType,
          isActive: roomData.isActive
        }),
      });
      
      if (!response.ok) {
        throw new Error('채팅방 생성에 실패했습니다.');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  }

  // 채팅방 목록 조회
  async getRooms() {
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
  }

  // 채팅방 참여
  async joinRoom(roomId) {
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

  // 채팅방 나가기
  async leaveRoom(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to leave chat room');
      }

      return await response.json();
    } catch (error) {
      console.error('Leave room error:', error);
      throw error;
    }
  }

  // 채팅방 정보 수정
  async updateRoom(roomId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update chat room');
      }

      return await response.json();
    } catch (error) {
      console.error('Update room error:', error);
      throw error;
    }
  }

  // 채팅방 삭제 (호스트만 가능)
  async deleteRoom(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat room');
      }

      return true;
    } catch (error) {
      console.error('Delete room error:', error);
      throw error;
    }
  }

  // 채팅방 참여자 목록 조회
  async getRoomMembers(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/members`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get room members');
      }

      return await response.json();
    } catch (error) {
      console.error('Get room members error:', error);
      throw error;
    }
  }

  // 채팅방 검색
  async searchRooms(keyword, page = 0, size = 5) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        
        if (keyword) {
            params.append('keyword', keyword);
        }

        const response = await fetch(`${API_BASE_URL}/api/chat/rooms/search?${params}`, {
            method: 'GET',
            headers: {
                ...authService.getAuthHeader()
            }
        });

        if (!response.ok) {
            throw new Error('채팅방 검색에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('Search rooms error:', error);
        throw error;
    }
}

  // WebSocket 관련 메서드들
  connect(roomId, onMessageCallback, onTypingCallback, onConnectedCallback, onErrorCallback) {
    const token = authService.getToken();
    
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws-chat`, null, {
        transports: ["websocket", "xhr-streaming", "xhr-polling"],
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        const subscribeHeaders = {
          'Authorization': `Bearer ${token}`
        };

        this.client.subscribe(
          `/topic/chat/${roomId}`,
          onMessageCallback,
          subscribeHeaders
        );

        this.client.subscribe(
          `/topic/typing/${roomId}`,
          onTypingCallback,
          subscribeHeaders
        );

        onConnectedCallback();
      },
      onDisconnect: () => {
        console.log('Disconnected!');
      },
      onStompError: (frame) => {
        onErrorCallback('Connection error: ' + frame.body);
      }
    });

    try {
      this.client.activate();
    } catch (err) {
      onErrorCallback('Failed to connect to chat server');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  sendMessage(message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(message)
      });
    }
  }

  sendTypingStatus(roomId, userId, isTyping) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/typing/${roomId}`,
        body: JSON.stringify({
          userId,
          isTyping
        })
      });
    }
  }

  async loadPreviousMessages(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/messages`, {
        headers: {
          ...authService.getAuthHeader()
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load messages:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const ChatService = new ChatServiceClass();
