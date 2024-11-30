import React, { useState, useEffect } from "react";
import { ChatService } from "../../services/chatService";
import { useAuth } from "../../hooks/useAuth";

const CommunityPage = ( { onPageChange } ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const handleJoinRoom = async (roomId) => {
        try {
            console.log('Attempting to join room with ID:', roomId);
            console.log('Current user:', currentUser);  // 유저 정보 확인
            await ChatService.joinRoom(roomId);
            console.log('Successfully joined room, attempting page change');
            onPageChange('chatRoom', { 
                roomId: roomId,
                currentUser: currentUser 
            });
        } catch (error) {
            console.error('Join room error:', error);  // 구체적인 에러 확인
            setError('채팅방 입장에 실패했습니다.');
        }
    };
    
    // 채팅방 목록 로드
    useEffect(() => {
        loadChatRooms();
    }, []);

    const loadChatRooms = async () => {
        try {
            setLoading(true);
            const rooms = await ChatService.getRooms();
            setChatRooms(rooms);
        } catch (error) {
            setError('채팅방 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newRoom = await ChatService.createRoom({
                roomName: roomName,
                description: roomDescription,
                roomType: true, // 오픈채팅
                isActive: true
            });
            
            // 새로운 채팅방을 목록에 추가
            setChatRooms(prev => [...prev, newRoom]);
            
            // 모달 닫고 입력 필드 초기화
            setIsModalOpen(false);
            setRoomName("");
            setRoomDescription("");
            
        } catch (error) {
            setError('채팅방 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">로딩 중...</div>;
    }

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">오픈채팅</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        disabled={loading}
                    >
                        채팅방 만들기
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {chatRooms.map((room) => (
                        <div 
                            key={room.id} 
                            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleJoinRoom(room.id)}
                        >
                            <h3 className="font-medium">{room.roomName}</h3>
                            <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                            <p className="text-sm text-gray-600">참여자: {room.memberCount || 0}명</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 채팅방 생성 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">새 채팅방 만들기</h3>
                        <form onSubmit={handleCreateRoom}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    방 이름
                                </label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="채팅방 이름을 입력하세요"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    방 설명
                                </label>
                                <textarea
                                    value={roomDescription}
                                    onChange={(e) => setRoomDescription(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="채팅방에 대한 설명을 입력하세요"
                                    rows="3"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    disabled={loading}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? '생성 중...' : '만들기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;