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
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleProfileClick = (senderId, senderName) => {
    console.log('Clicked profile:', { senderId, senderName });
    onPageChange('someoneInfo', {
        memberId: senderId,
        name: senderName
    });
  };
  
  const formatMessageTime = (createdAt) => {
    if (!createdAt) return '';
    
    try {
      const messageDate = new Date(createdAt);
      
      if (isNaN(messageDate.getTime())) {
        console.error('Invalid date:', createdAt);
        return '';
      }
  
      const today = new Date();
      const isToday = messageDate.toDateString() === today.toDateString();
  
      if (isToday) {
        return messageDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } else {
        return messageDate.toLocaleString('ko-KR', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
  
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  const sortMessagesByTime = (messages) => {
    return [...messages].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const maintainScrollPosition = useCallback((prevHeight) => {
    if (chatContainerRef.current) {
      const newHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTop = newHeight - prevHeight;
    }
  }, []);

  const handleMessage = useCallback((message) => {
    const receivedMessage = JSON.parse(message.body);
    setMessages(prevMessages => {
      // 이미 존재하는 메시지인지 확인
      const isDuplicate = prevMessages.some(msg => 
        msg.createdAt === receivedMessage.createdAt && 
        msg.senderId === receivedMessage.senderId &&
        msg.content === receivedMessage.content
      );
      if (isDuplicate) return prevMessages;
      
      const newMessages = [...prevMessages, receivedMessage];
      return sortMessagesByTime(newMessages);
    });
    
    if (shouldScrollToBottom || receivedMessage.senderId === currentUser.id) {
      requestAnimationFrame(scrollToBottom);
    }
  }, [currentUser.id, shouldScrollToBottom, scrollToBottom]);

  const handleTyping = useCallback((message) => {
    const { userId, isTyping } = JSON.parse(message.body);
    if (userId !== currentUser.id) {
      setIsTyping(isTyping);
    }
  }, [currentUser.id]);

  // 초기 메시지 로드
  const loadInitialMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ChatService.loadRecentMessages(roomId);
      
      // sortMessagesByTime을 사용하여 메시지 정렬
      const sortedMessages = sortMessagesByTime(response.messages);
      setMessages(sortedMessages);
      
      setHasMore(response.hasMore);
      if (sortedMessages.length > 0) {
        setLastMessageTime(sortedMessages[0].createdAt);
      }
    } catch (error) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [roomId]);
  
  // 이전 메시지 로드
  const loadPreviousMessages = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    try {
      setIsLoading(true);
      const prevHeight = chatContainerRef.current?.scrollHeight || 0;
      const response = await ChatService.loadPreviousMessages(roomId, lastMessageTime);
      
      if (response.messages.length === 0) {
        setHasMore(false);
        return;
      }
  
      setMessages(prevMessages => {
        // 중복 메시지 필터링
        const newMessages = response.messages.filter(newMsg => 
          !prevMessages.some(existingMsg => 
            existingMsg.createdAt === newMsg.createdAt && 
            existingMsg.senderId === newMsg.senderId &&
            existingMsg.content === newMsg.content
          )
        );
        
        if (newMessages.length === 0) return prevMessages;
        
        const allMessages = [...newMessages, ...prevMessages];
        return sortMessagesByTime(allMessages);
      });

      if (!isInitialLoad) {
        requestAnimationFrame(() => {
          maintainScrollPosition(prevHeight);
        });
      }

      setHasMore(response.hasMore);
      if (response.messages.length > 0) {
        setLastMessageTime(response.messages[0].createdAt);
      }

    } catch (error) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
        scrollToBottom();
      }
    }
  }, [roomId, lastMessageTime, isLoading, hasMore, isInitialLoad, maintainScrollPosition, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current || isInitialLoad) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    
    if (scrollTop === 0 && hasMore && !isLoading) {
      loadPreviousMessages();
    }
    
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    setShouldScrollToBottom(isNearBottom);
  }, [hasMore, isLoading, isInitialLoad, loadPreviousMessages]);

  // 나머지 이벤트 핸들러들...
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

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    let isSubscribed = true;
  
    ChatService.connect(
      roomId,
      handleMessage,
      handleTyping,
      () => {
        if (isSubscribed) {
          setIsConnected(true);
          setError(null);
          loadInitialMessages(); // 초기 메시지 로드
        }
      },
      setError
    );
  
    return () => {
      isSubscribed = false;
      ChatService.disconnect();
      setIsConnected(false);
    };
  }, [roomId, handleMessage, handleTyping, loadInitialMessages]);

  return (
    <div className="flex flex-col h-screen relative">
      {error && (
        <Alert variant="destructive" className="m-2 mt-16">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* [변경] 로딩 인디케이터 추가 */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 mt-16 mb-20">
        {isLoading && (
          <div className="text-center py-2 text-gray-500">
            Loading previous messages...
          </div>
        )}
        
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

      <div className="fixed bottom-16 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-[1000] max-w-md mx-auto">
        <form onSubmit={sendMessage} className="p-4 w-full">
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