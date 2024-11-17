import React from "react";

// MyPage
const MyPage = () => {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full"></div>
            <div>
              <h2 className="font-semibold">사용자님</h2>
              <p className="text-sm text-gray-600">반려동물: 멍멍이</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full p-2 text-left border rounded-lg">개인정보 수정</button>
            <button className="w-full p-2 text-left border rounded-lg">구매관리</button>
            <button className="w-full p-2 text-left border rounded-lg">피드관리</button>
            <button className="w-full p-2 text-left border rounded-lg">친구관리</button>
          </div>
        </div>
      </div>
    );
  };

export default MyPage;