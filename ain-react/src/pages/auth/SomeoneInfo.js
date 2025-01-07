import { User } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberService } from '../../services/MemberService';
import { CustomButton } from './custom-button.tsx';
import { MemberList } from "./member-list";
import { PetCarousel } from './pet-carousel.tsx';

const SomeoneInfo = ({ pageData }) => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        member: null,
        pets: [],
        follows: { follower: 0, following: 0 },
        isFollowing: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState("pets");
    const [members, setMembers] = useState([]);

    // 초기 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            if (!pageData?.memberId) return;

            try {
                const response = await memberService.getSomeoneInfo(pageData.memberId);
                console.log('Fetched data:', response);

                setData({
                    member: response.member,
                    pets: Array.isArray(response.pet) ? response.pet : (response.pet ? [response.pet] : []),
                    follows: response.follows || { follower: 0, following: 0 },
                    isFollowing: response.isFollowing || false,
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pageData?.memberId]);

    // 멤버 데이터 로드 함수
    const fetchMembers = useCallback(async (type) => {
        try {
            const response =
                type === "followers"
                    ? await memberService.getFollowers(pageData.memberId)
                    : await memberService.getFollowing(pageData.memberId);
    
            console.log("Fetched members:", response);
    
            // 각 멤버의 팔로우 상태를 개별적으로 확인
            const membersWithStatus = await Promise.all(
                response.map(async (member) => {
                    try {
                        // 각 멤버에 대해 getSomeoneInfo를 호출하여 팔로우 상태 확인
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
            setActiveTab("members");
        } catch (err) {
            console.error("Error fetching members:", err);
        }
    }, [pageData?.memberId]);

    // 탭 전환 시 멤버 데이터 로드
    useEffect(() => {
        if (activeTab === "members") {
            fetchMembers("followers");
        }
    }, [activeTab, pageData?.memberId, fetchMembers]);

    // 개인 프로필 팔로우/언팔로우
    const handleFollowClick = async () => {
        if (!data?.member?.id || isProcessing) return;

        setIsProcessing(true);
        
        try {
            // 로컬 상태 즉시 업데이트
            setData((prev) => ({
                ...prev,
                isFollowing: !prev.isFollowing,
            }));

            // 서버 요청
            if (data.isFollowing) {
                await memberService.unfollowMember(data.member.id);
            } else {
                await memberService.followMember(data.member.id);
            }
        } catch (err) {
            console.error("Error handling follow:", err);

            // 서버 요청 실패 시 로컬 상태 복구
            setData((prev) => ({
                ...prev,
                isFollowing: !prev.isFollowing,
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    // 팔로우 토글
    const handleFollowToggle = async (memberId) => {
        console.log("Follow toggle called for memberId:", memberId);
        setIsProcessing(true);

        // 로컬 상태 즉시 업데이트
        setMembers((prev) =>
            prev.map((m) =>
                m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m
            )
        );

        try {
            // 서버 요청
            const memberToUpdate = members.find((m) => m.id === memberId);
            if (!memberToUpdate) return;

            if (memberToUpdate.isFollowing) {
                await memberService.unfollowMember(memberId);
            } else {
                await memberService.followMember(memberId);
            }
        } catch (err) {
            console.error("Error toggling follow status:", err);

            // 서버 요청 실패 시 로컬 상태 복구
            setMembers((prev) =>
                prev.map((m) =>
                    m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m
                )
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMemberClick = (memberId) => {
        navigate(`/profile/${memberId}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const stats = [
        {
            label: "반려동물",
            value: data.pets?.length || 0,
        },
        {
            label: "팔로워",
            value: data.follows?.follower || 0,
            onClick: () => fetchMembers("followers"),
        },
        {
            label: "팔로잉",
            value: data.follows?.following || 0,
            onClick: () => fetchMembers("following"),
        },
    ];

    const tabs = [
        { id: "pets", label: "반려동물" },
        { id: "posts", label: "게시물" },
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="shrink-0">
                        <div className="h-20 w-20 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {data.member?.profilePictureUrl ? (
                                <img
                                    src={data.member.profilePictureUrl}
                                    alt={data.member.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">{data.member?.name}</h2>
                        <div className="grid grid-cols-3 gap-4 mb-4 w-full max-w-[400px] mx-auto sm:mx-0">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center cursor-pointer"
                                    onClick={stat.onClick}
                                >
                                    <span className="font-semibold block">{stat.value}</span>
                                    <span className="text-sm text-gray-600 block whitespace-nowrap">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center sm:justify-start mb-4">
                            <CustomButton
                                onClick={handleFollowClick}
                                disabled={isProcessing}
                                variant={data.isFollowing ? "outline" : "default"}
                                className="w-[200px]"
                            >
                                {data.isFollowing ? "팔로잉" : "팔로우"}
                            </CustomButton>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <div className="grid grid-cols-2 w-full">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 text-xs font-medium tracking-wider uppercase text-center ${
                                    activeTab === tab.id
                                        ? "text-black border-b-2 border-black"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === "pets" && (
                        <div>
                            {data.pets && data.pets.length > 0 ? (
                                <PetCarousel pets={data.pets} />
                            ) : (
                                <div className="text-gray-500 text-center">
                                    아직 등록된 반려동물이 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "posts" && (
                        <div className="text-center text-sm text-gray-500">
                            아직 게시물이 없습니다.
                        </div>
                    )}
                    {activeTab === "members" && (
                        <MemberList
                            members={members}
                            onMemberClick={handleMemberClick}
                            onFollowToggle={handleFollowToggle}
                            
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SomeoneInfo;
