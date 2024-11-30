import React, { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Send, Image, Paperclip } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert'
import { authService } from '../../services/authService';

const ChatRoom = ({ roomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleMessage = useCallback((message) => {
    const receivedMessage = JSON.parse(message.body);
    setMessages(prev => [...prev, receivedMessage]);
  }, []);

  const handleTyping = useCallback((message) => {
    const { userId, isTyping } = JSON.parse(message.body);
    if (userId !== currentUser.id) {
      setIsTyping(isTyping);
    }
  }, [currentUser.id]);

  const sendTypingStatus = useCallback((isTyping) => {
    if (stompClient && isConnected) {
      stompClient.publish({
        destination: `/app/typing/${roomId}`,
        body: JSON.stringify({
          userId: currentUser.id,
          isTyping
        })
      });
    }
  }, [stompClient, isConnected, roomId, currentUser.id]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    sendTypingStatus(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 1000);
  };

  const loadPreviousMessages = useCallback(async () => {
    try {
      const token = authService.getToken(); // JWT 토큰 가져오기
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [roomId]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    const chatMessage = {
      roomId: roomId,
      senderId: currentUser.id,
      content: inputMessage,
      messageType: 'TEXT',
      senderName: currentUser.name,
      timestamp: new Date().toISOString()
    };

    try {
      stompClient.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(chatMessage)
      });
      setInputMessage('');
      sendTypingStatus(false);
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => {
    const connectWebSocket = () => {
      const token = authService.getToken(); // JWT 토큰 가져오기

      const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:9999/ws-chat', null, {
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
          setIsConnected(true);
          setError(null);
          // 구독할 때마다 헤더 추가
          const subscribeHeaders = {
            'Authorization': `Bearer ${token}`
          };
          client.subscribe(
            `/topic/chat/${roomId}`, 
            handleMessage, 
            subscribeHeaders
          );
          client.subscribe(
            `/topic/typing/${roomId}`, 
            handleTyping,
            subscribeHeaders
          );
          loadPreviousMessages();
        },
        onDisconnect: () => {
          setIsConnected(false);
          console.log('Disconnected!');
        },
        onStompError: (frame) => {
          setError('Connection error: ' + frame.body);
          // 인증 오류인 경우 재로그인 유도
          if (frame.headers['message'] === 'Unauthorized') {
            setError('Session expired. Please login again.');
            // 로그인 페이지로 리다이렉트하거나 재인증 프로세스 시작
          }
        }
      });

      try {
        client.activate();
        setStompClient(client);
      } catch (err) {
        setError('Failed to connect to chat server');
      }

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    };

    connectWebSocket();
  }, [roomId, handleMessage, handleTyping, loadPreviousMessages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 채팅방 헤더 */}
      <div className="bg-white shadow p-4">
        <h2 className="text-xl font-semibold">Chat Room #{roomId}</h2>
        {!isConnected && (
          <span className="text-sm text-red-500">Disconnected - Reconnecting...</span>
        )}
      </div>

      {/* 에러 알림 */}
      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.senderId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
            >
              {msg.senderId !== currentUser.id && (
                <div className="text-sm text-gray-600 mb-1">{msg.senderName}</div>
              )}
              <div>{msg.content}</div>
              <div className="text-xs mt-1 opacity-70">
                {formatMessageTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 italic">
            Someone is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 폼 */}
      <form onSubmit={sendMessage} className="bg-white p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Image className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Paperclip className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={!isConnected}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;