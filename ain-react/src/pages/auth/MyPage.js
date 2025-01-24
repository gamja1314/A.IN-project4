import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/apiConfig";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import './MyPage.css';
import PetRegistrationModal from './PetRegistrationModal';
import ProfileEditModal from './ProfileEditModal';

const MyPage = ({ onPageChange }) => {
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberInfo, setMemberInfo] = useState({
    member: null,
    pets: [],
    follows: { follower: 0, following: 0 }
  });
  
  const [activeTab, setActiveTab] = useState("pets");
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  
  // 반려동물 모달 상태 추가
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isEditPetMode, setIsEditPetMode] = useState(false);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const headers = {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        };

        const response = await fetch(`${API_BASE_URL}/api/member/my`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!response.ok) throw new Error("회원 정보를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("API 응답 데이터:", data);

        if (data.member) {
          setMemberInfo({
            member: data.member,
            pets: Array.isArray(data.pets) ? data.pets : (data.pet ? [data.pet] : []),
            follows: data.follows || { follower: 0, following: 0 }
          });
        } else {
          setError("회원 정보가 없습니다.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("회원 정보를 가져오는 데 실패했습니다.");
      }
    };

    fetchMemberInfo();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logout();
      authService.logout();
    } catch (error) {
      setError(error.message || "로그아웃에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdateSuccess = async () => {
    try {
      const headers = {
        ...authService.getAuthHeader(),
        "Content-Type": "application/json",
      };

      const response = await fetch(`${API_BASE_URL}/api/member/my`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!response.ok) throw new Error("회원 정보를 가져오는 데 실패했습니다.");

      const data = await response.json();
      setMemberInfo({
        member: data.member,
        pets: Array.isArray(data.pets) ? data.pets : (data.pet ? [data.pet] : []),
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const openPetRegistrationModal = (pet = null) => {
    setSelectedPet(pet);
    setIsEditPetMode(!!pet);
    setIsPetModalOpen(true);
  };

  const handlePetSubmitSuccess = () => {
    // 반려동물 정보 새로고침
    const fetchMemberInfo = async () => {
      try {
        const headers = {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        };

        const response = await fetch(`${API_BASE_URL}/api/member/my`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        const data = await response.json();
        if (data.member) {
          setMemberInfo({
            member: data.member,
            pets: Array.isArray(data.pets) ? data.pets : (data.pet ? [data.pet] : []),
          });
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchMemberInfo();
    setIsPetModalOpen(false);
  };

  const stats = [
    { 
      label: "반려동물", 
      value: memberInfo?.pets?.[0]?.length || 0 
    },
    { 
      label: "팔로워", 
      value: memberInfo?.follows?.follower || 0,
      onClick: () => onPageChange('followerList', { 
        memberId: memberInfo?.member?.id,
        listType: 'followers',
        name: memberInfo?.member?.name,
        source: 'mypage'
      })
    },
    { 
      label: "팔로잉", 
      value: memberInfo?.follows?.following || 0,
      onClick: () => onPageChange('followerList', { 
        memberId: memberInfo?.member?.id,
        listType: 'following',
        name: memberInfo?.member?.name,
        source: 'mypage'
      })
    }
  ];

  const tabs = [
    { id: "pets", label: "반려동물" },
    { id: "posts", label: "게시물" },
    { id: "saved", label: "저장됨" },
    { id: "tagged", label: "태그됨" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 h-14 flex justify-between items-center">
          <h1 className="text-xl font-semibold">애니멀 인사이드</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="text-sm text-blue-500 font-medium disabled:opacity-50"
          >
            {loading ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* 프로필 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="shrink-0">
              <div className="h-20 w-20 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {memberInfo?.member?.profilePictureUrl ? (
                  <img
                    src={memberInfo?.member?.profilePictureUrl}
                    alt={memberInfo?.member?.name || "사용자"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-light mb-4 text-center">
                {memberInfo?.member?.name || "사용자"} 님
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4 w-full max-w-[400px] mx-auto sm:mx-0">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`text-center ${stat.onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={stat.onClick}
                  >
                    <span className="font-semibold block">{stat.value}</span>
                    <span className="text-sm text-gray-600 block whitespace-nowrap">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mb-4">
                <button 
                  onClick={() => setIsProfileEditModalOpen(true)}
                  className="px-8 py-1.5 border rounded text-sm font-medium hover:bg-gray-50 w-[200px]">
                  프로필 편집
                </button>
              </div>
              <div className="text-sm text-center">
                <p className="text-gray-900">{memberInfo?.member?.email || "이메일 없음"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="grid grid-cols-4 w-full">
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

          <div className="p-4">
            {activeTab === "pets" && (
              <div className="grid grid-cols-3 gap-4">
                {memberInfo?.pets && memberInfo.pets[0]?.length > 0 ? (
                  memberInfo.pets[0].map((pet, index) => (
                    <div key={pet.id} className="relative pb-[100%]">
                      <div className="absolute inset-0">
                        {pet.photoUrl ? (
                          <img
                            src={pet.photoUrl}
                            alt={pet.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                            <span className="text-gray-400">No Photo</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded">
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-sm font-medium">{pet.name}</p>
                            <p className="text-xs">{pet.species} | {pet.age}살</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-3">등록된 반려동물이 없습니다.</p>
                )}
              </div>
            )}

            {activeTab === "posts" && (
              <div className="py-10 text-center text-sm text-gray-500">아직 게시물이 없습니다.</div>
            )}
            {activeTab === "saved" && (
              <div className="py-10 text-center text-sm text-gray-500">저장된 항목이 없습니다.</div>
            )}
            {activeTab === "tagged" && (
              <div className="py-10 text-center text-sm text-gray-500">태그된 게시물이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 계정 설정 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border divide-y">
          <button className="w-full py-3.5 px-4 text-left text-sm font-medium hover:bg-gray-50">
            계정 설정
          </button>
          <button className="w-full py-3.5 px-4 text-left text-sm font-medium hover:bg-gray-50">
            팔로우 관리
          </button>
        </div>

        {/* 반려동물 관리 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border divide-y">
          <button
            onClick={() => openPetRegistrationModal()}
            className="w-full py-3.5 px-4 text-left text-sm font-medium hover:bg-gray-50"
          >
            반려동물 등록
          </button>

          {memberInfo?.pets?.[0]?.length > 0 &&
            memberInfo.pets[0].map((pet, index) => (
              <button
                key={index}
                onClick={() => openPetRegistrationModal(pet)}
                className="w-full py-3.5 px-4 text-left text-sm font-medium hover:bg-gray-50"
              >
                {pet.name} 수정
              </button>
            ))}
        </div>
      </main>

      {/* 모달 섹션 */}
      {isProfileEditModalOpen && (
        <ProfileEditModal 
          memberInfo={memberInfo?.member} 
          onClose={() => setIsProfileEditModalOpen(false)}
          onUpdate={handleProfileUpdateSuccess}
        />
      )}

      {isPetModalOpen && (
        <PetRegistrationModal
          petInfo={selectedPet}
          isEditMode={isEditPetMode}
          onClose={() => setIsPetModalOpen(false)}
          onSubmit={handlePetSubmitSuccess}
        />
      )}
    </div>
  );
};

export default MyPage;