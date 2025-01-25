import { User } from 'lucide-react';
import React from "react";
import { CustomButton } from './custom-button.tsx';

export const MemberList = ({ members, onMemberClick, onFollowToggle }) => {
    if (!members || members.length === 0) {
        return <div className="text-center text-gray-500">멤버가 없습니다.</div>;
    }

    return (
        <ul className="space-y-4">
            {members.map((member) => (
                <li
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                    {/* 멤버 프로필 클릭 가능 영역 */}
                    <div
                        className="flex items-center space-x-3 cursor-pointer hover:text-blue-500"
                        onClick={() => onMemberClick(member.id, member.name)}
                    >
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {member.profilePictureUrl ? (
                                <img
                                    src={member.profilePictureUrl}
                                    alt={member.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                        <span className="font-medium">{member.name}</span>
                    </div>

                    {/* 팔로우/언팔로우 버튼 */}
                    {onFollowToggle && (
                        <CustomButton
                            variant={member.isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation(); // 부모 클릭 이벤트 차단
                                onFollowToggle(member.id);
                            }}
                        >
                            {member.isFollowing ? "팔로잉" : "팔로우"}
                        </CustomButton>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default MemberList;
