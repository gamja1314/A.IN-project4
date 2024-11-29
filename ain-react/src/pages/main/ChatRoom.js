import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoom = ({ roomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9999/ws-chat'),
      onConnect: () => {
        console.log('Connected!');
        // 채팅방 구독
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });
        
        // 이전 메시지 로드
        loadPreviousMessages();
      },
      onDisconnect: () => {
        console.log('Disconnected!');
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [roomId]);

  // 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 이전 메시지 로드
  const loadPreviousMessages = async () => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // 메시지 전송
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const chatMessage = {
      roomId: roomId,
      senderId: currentUser.id,
      content: inputMessage,
      messageType: 'TEXT',
      senderName: currentUser.name
    };

    stompClient.publish({
      destination: '/app/chat/message',
      body: JSON.stringify(chatMessage)
    });

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 채팅방 헤더 */}
      <div className="bg-white shadow p-4">
        <h2 className="text-xl font-semibold">Chat Room #{roomId}</h2>
      </div>

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
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 폼 */}
      <form onSubmit={sendMessage} className="bg-white p-4 shadow-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;