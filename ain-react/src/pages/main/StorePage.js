import React from 'react';

const StorePage = () => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-4">반려동물 용품</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-2">
            <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
            <h3 className="font-medium">강아지 사료</h3>
            <p className="text-sm text-gray-600">29,900원</p>
          </div>
          <div className="border rounded-lg p-2">
            <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
            <h3 className="font-medium">고양이 장난감</h3>
            <p className="text-sm text-gray-600">12,900원</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;