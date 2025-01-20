import React from 'react';
import { FaCog } from 'react-icons/fa'; // Import icon settings

function RightSidebar() {
  return (
    <div className="bg-gray-100 w-full h-full p-4">
      {/* User List */}
      <div className="space-y-4">
        {/* User Item */}
        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/4.jpg" // Thay thế với ảnh đại diện thực tế
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-green-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <div className="ml-3">
            <div className="font-semibold">Thanh Tùng</div>
            <div className="text-sm text-gray-500">Chủ Tịch</div>
          </div>
        </div>

        {/* Add more users like the example above */}
        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg" // Thay thế với ảnh đại diện thực tế
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue-500"></span>
          </div>
          <div className="ml-3">
            <div className="font-semibold">Ngọc Huy </div>
            <div className="text-sm text-gray-500">Giám đốc</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/2.jpg" // Thay thế với ảnh đại diện thực tế
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-pink-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-pink-500"></span>
          </div>
          <div className="ml-3">
            <div className="font-semibold">Cảnh Ngáo</div>
            <div className="text-sm text-gray-500">Nhân viên</div>
          </div>
        </div>

        {/* More users can be added similarly */}
        {/* Add settings icon at the bottom */}
        <div className="flex justify-end mt-4">
          <FaCog className="text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
