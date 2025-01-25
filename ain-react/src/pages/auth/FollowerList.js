import { React, useEffect, useState } from 'react';
import { memberService } from '../../services/MemberService';
import { MemberList } from './member-list';

export const FollowerList = ({ pageData, onPageChange }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = pageData.listType === 'followers'
          ? await memberService.getFollowers(pageData.memberId)
          : await memberService.getFollowing(pageData.memberId);

        const membersWithStatus = await Promise.all(
          response.map(async (member) => {
            try {
              const memberInfo = await memberService.getSomeoneInfo(member.id);
              return {
                ...member,
                isFollowing: memberInfo.isFollowing || false
              };
            } catch (err) {
              console.error(`Error fetching status for member ${member.id}:`, err);
              return {
                ...member,
                isFollowing: false
              };
            }
          })
        );

        setMembers(membersWithStatus);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [pageData.memberId, pageData.listType]);

  const handleMemberClick = (memberId) => {
    onPageChange('someoneInfo', { memberId });
  };

  const handleFollowToggle = async (memberId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m
      )
    );

    try {
      const memberToUpdate = members.find((m) => m.id === memberId);
      if (!memberToUpdate) return;

      if (memberToUpdate.isFollowing) {
        await memberService.unfollowMember(memberId);
      } else {
        await memberService.followMember(memberId);
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m
        )
      );
    }
  };

  if (isLoading) return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        Loading...
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4">Error: {error}</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4">
        <MemberList
          members={members}
          onMemberClick={handleMemberClick}
          onFollowToggle={handleFollowToggle}
        />
      </div>
    </div>
  );
};