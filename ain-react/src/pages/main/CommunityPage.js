import React from "react";

// Community Page
const CommunityPage = () => {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">오픈채팅</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-3">
              <h3 className="font-medium">강아지 산책 모임</h3>
              <p className="text-sm text-gray-600">참여자: 23명</p>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-medium">고양이 집사 모임</h3>
              <p className="text-sm text-gray-600">참여자: 45명</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default CommunityPage;