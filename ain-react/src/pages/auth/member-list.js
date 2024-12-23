import React from "react";

export const MemberList = ({ members, onMemberClick }) => {
    if (!members || members.length === 0) {
        return <div className="text-center text-gray-500">멤버가 없습니다.</div>;
    }

    return (
        <ul className="space-y-2">
            {members.map((member) => (
                <li
                    key={member.id}
                    className="cursor-pointer text-blue-500 hover:underline"
                    onClick={() => onMemberClick(member.id)}
                >
                    {member.name}
                </li>
            ))}
        </ul>
    );
};
