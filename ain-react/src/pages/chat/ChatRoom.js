import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Image, Paperclip } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ChatService } from '../../services/chatService';

const ChatRoom = ({ roomId, currentUser, onPageChange, onMessageSent, onExit }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [shouldScrollToBottom]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    setShouldScrollToBottom(isNearBottom);
  }, []);

  const handleMessage = useCallback((message) => {
    const receivedMessage = JSON.parse(message.body);
    setMessages(prev => [...prev, receivedMessage]);
    // 새 메시지가 현재 사용자의 것이거나 스크롤이 하단에 있을 때만 자동 스크롤
    if (receivedMessage.senderId === currentUser.id || shouldScrollToBottom) {
      setTimeout(scrollToBottom, 100);
    }
  }, [currentUser.id, scrollToBottom, shouldScrollToBottom]);

  const handleTyping = useCallback((message) => {
    const { userId, isTyping } = JSON.parse(message.body);
    if (userId !== currentUser.id) {
      setIsTyping(isTyping);
    }
  }, [currentUser.id]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    ChatService.sendTypingStatus(roomId, currentUser.id, true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      ChatService.sendTypingStatus(roomId, currentUser.id, false);
    }, 1000);
  };

  const loadPreviousMessages = useCallback(async () => {
    try {
      const data = await ChatService.loadPreviousMessages(roomId);
      setMessages(data);
      // 초기 메시지 로드 후 스크롤을 맨 아래로
      setTimeout(scrollToBottom, 100);
      onMessageSent?.();
    } catch (error) {
      setError('Failed to load messages');
    }
  }, [roomId, onMessageSent, scrollToBottom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    const now = new Date();
    const koreanTime = new Date(now.getTime() + (9*60*60*1000));
    const chatMessage = {
      roomId: roomId,
      senderId: currentUser.id,
      content: inputMessage,
      messageType: 'TEXT',
      senderName: currentUser.name,
      createdAt: koreanTime.toISOString()
    };

    try {
      ChatService.sendMessage(chatMessage);
      setInputMessage('');
      ChatService.sendTypingStatus(roomId, currentUser.id, false);
      setShouldScrollToBottom(true);
    } catch (err) {
      setError('Failed to send message');
      console.log(err);
    }
  };

  // formatMessageTime 함수 추가
  const formatMessageTime = (createdAt) => {
    if (!createdAt) return '';
    
    try {
        const date = new Date(createdAt);
        
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', createdAt);
            return '';
        }

        return date.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
  };

  const handleProfileClick = (senderId, senderName) => {
    console.log('Clicked profile:', { senderId, senderName }); // 데이터 확인용 로그
    onPageChange('someoneInfo', {
        memberId: senderId,
        name: senderName
    });
  };
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
      return () => chatContainerRef.current?.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    ChatService.connect(
      roomId,
      handleMessage,
      handleTyping,
      () => {
        setIsConnected(true);
        setError(null);
        loadPreviousMessages();
      },
      setError
    );

    return () => {
      ChatService.disconnect();
      setIsConnected(false);
    };
  }, [roomId, handleMessage, handleTyping, loadPreviousMessages]);

  return (
    <div className="flex flex-col h-screen relative">  {/* relative 추가 */}
  
      {/* 에러 알림 */}
      {error && (
        <Alert variant="destructive" className="m-2 mt-16">  {/* 헤더 아래로 margin 추가 */}
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
  
      {/* 메시지 목록 - 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-4 mt-16 mb-20">  {/* 상단/하단 여백 조정 */}
      {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'} mb-4`}>
                {msg.senderId !== currentUser.id && (
                    <div 
                        className="flex-shrink-0 mr-2 cursor-pointer" 
                        onClick={() => handleProfileClick(msg.senderId, msg.senderName)}
                    >
                        <img 
                            src={msg.senderProfileUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(msg.senderName)}`}
                            alt={`${msg.senderName}의 프로필`}
                            className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                    </div>
                )}
                
                <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}>
                    {/* {msg.senderId !== currentUser.id && (
                        <div className="text-sm font-semibold text-gray-800 mb-1">{msg.senderName}</div>
                    )} */}
                    <div>{msg.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                        {formatMessageTime(msg.createdAt)}
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
  
      {/* 메시지 입력 폼 - 하단 고정 */}
      <div className="fixed bottom-16 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-[1000] max-w-md mx-auto">  {/* bottom-14로 네비게이션바 위에 위치 */}
        <form onSubmit={sendMessage} className="p-4">
        <div className="flex items-center space-x-2">
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
            <Image className="w-6 h-6" />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
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
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ChatRoom;