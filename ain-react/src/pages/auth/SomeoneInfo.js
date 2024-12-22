import React, { useState, useEffect } from 'react';
import { User, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { memberService } from '../../services/MemberService';

// 커스텀 버튼 컴포넌트
const CustomButton = ({ onClick, disabled, variant, className, children }) => {
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
    const variants = {
        default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant || 'default']} ${className || ''}`}
        >
            {children}
        </button>
    );
};

// 반려동물 정보 카드 컴포넌트
const PetCard = ({ pet }) => (
    <div className="space-y-4">
        <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {pet.photoUrl ? (
                    <img 
                        src={pet.photoUrl} 
                        alt={pet.name} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400 text-center">
                        <span className="block">No Photo</span>
                    </div>
                )}
            </div>
            <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500">이름</p>
                        <p className="font-medium">{pet.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">나이</p>
                        <p className="font-medium">{pet.age}세</p>
                    </div>
                    <div>
                        <p className="text-gray-500">종류</p>
                        <p className="font-medium">{pet.species}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">품종</p>
                        <p className="font-medium">{pet.breed}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">성별</p>
                        <p className="font-medium">{pet.gender}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// 반려동물 캐러셀 컴포넌트
const PetCarousel = ({ pets }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextPet = () => {
        setCurrentIndex((prev) => (prev + 1) % pets.length);
    };

    const prevPet = () => {
        setCurrentIndex((prev) => (prev - 1 + pets.length) % pets.length);
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">반려동물 정보</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {pets.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={prevPet}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={pets.length <= 1}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextPet}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={pets.length <= 1}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <PetCard pet={pets[currentIndex]} />
        </div>
    );
};

const SomeoneInfo = ({ pageData }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!pageData?.memberId) return;
            
            try {
                const response = await memberService.getSomeoneInfo(pageData.memberId);
                console.log('Fetched data:', response);
                setData(response);
                setIsFollowing(response.isFollowing || false);
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
            if (isFollowing) {
                await memberService.unfollowMember(data.member.id);
                setIsFollowing(false);
            } else {
                await memberService.followMember(data.member.id);
                setIsFollowing(true);
            }
            
            const updatedData = await memberService.getSomeoneInfo(pageData.memberId);
            setData(updatedData);
        } catch (err) {
            console.error('Error handling follow:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg">
                {/* 프로필 섹션 */}
                <div className="p-6 flex flex-row items-center gap-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {data.member.profilePictureUrl ? (
                            <img 
                                src={data.member.profilePictureUrl} 
                                alt={data.member.name} 
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-12 w-12 text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{data.member.name}</h2>
                            <CustomButton
                                onClick={handleFollowClick}
                                disabled={isProcessing}
                                variant={isFollowing ? "outline" : "default"}
                                className="ml-4"
                            >
                                {isFollowing ? '언팔로우' : '팔로우'}
                            </CustomButton>
                        </div>
                        <div className="flex gap-4 mt-2 text-gray-600">
                            <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>팔로워 {data.follows?.follower || 0}</span>
                            </div>
                            <div>
                                <span>팔로잉 {data.follows?.following || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 반려동물 정보 섹션 */}
                <div className="p-6 border-t border-gray-200">
                    {Array.isArray(data.pet) && data.pet.length > 0 ? (
                        <PetCarousel pets={data.pet} />
                    ) : (
                        <div className="mt-4 text-gray-500 text-center">
                            아직 등록된 반려동물이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SomeoneInfo;