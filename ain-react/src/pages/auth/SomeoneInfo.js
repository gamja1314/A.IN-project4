import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트
import { memberService } from '../../services/MemberService';
import { CustomButton } from './custom-button.tsx';
import { MemberList } from "./member-list";
import { PetCarousel } from './pet-carousel.tsx';

const SomeoneInfo = ({ pageData }) => {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 얻기
    
    const [data, setData] = useState({
        member: null,
        pets: [],
        follows: { follower: 0, following: 0 },
        isFollowing: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState("pets");
    const [members, setMembers] = useState([]); // 팔로워/팔로잉 목록 저장

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
                    isFollowing: response.isFollowing || false
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

    const handleFollowClick = async () => {
        if (!data?.member?.id || isProcessing) return;

        setIsProcessing(true);
        try {
            if (data.isFollowing) {
                await memberService.unfollowMember(data.member.id);
                setData(prev => ({ ...prev, isFollowing: false }));
            } else {
                await memberService.followMember(data.member.id);
                setData(prev => ({ ...prev, isFollowing: true }));
            }

            const updatedData = await memberService.getSomeoneInfo(pageData.memberId);
            setData(prev => ({
                ...prev,
                follows: updatedData.follows || { follower: 0, following: 0 }
            }));
        } catch (err) {
            console.error('Error handling follow:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchMembers = async (type) => {
        try {
            const response =
                type === "followers"
                    ? await memberService.getFollowers(pageData.memberId)
                    : await memberService.getFollowing(pageData.memberId);
            setMembers(response);
            setActiveTab("members"); // 'members' 탭을 활성화
        } catch (err) {
            console.error("Error fetching members:", err);
        }
    };

    const handleMemberClick = (memberId) => {
        navigate(`/profile/${memberId}`); // useNavigate 훅을 사용하여 페이지 이동
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const stats = [
        {
            label: "반려동물",
            value: data.pets?.length || 0
        },
        {
            label: "팔로워",
            value: data.follows?.follower || 0,
            onClick: () => fetchMembers("followers")
        },
        {
            label: "팔로잉",
            value: data.follows?.following || 0,
            onClick: () => fetchMembers("following")
        },
    ];

    const tabs = [
        { id: "pets", label: "반려동물" },
        { id: "posts", label: "게시물" },
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Profile section */}
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
                                {data.isFollowing ? "언팔로우" : "팔로우"}
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Tab navigation */}
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

                {/* Tab content */}
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
                        <MemberList members={members} onMemberClick={handleMemberClick} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SomeoneInfo;
