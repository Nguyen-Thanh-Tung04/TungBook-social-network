import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGoogle, FaLinkedin } from 'react-icons/fa'; // Các biểu tượng mạng xã hội

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("first");

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg" // Avatar người dùng
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-4 border-white"
          />
          <div className="ml-4 text-white">
            <h1 className="text-2xl font-semibold">Thanh Tùng</h1>
            <div className="text-sm">Posts: 690 | Followers: 206 | Following: 100</div>
          </div>
        </div>
        <div className="flex space-x-4">
          <FaFacebook className="text-white text-xl" />
          <FaTwitter className="text-white text-xl" />
          <FaInstagram className="text-white text-xl" />
          <FaGoogle className="text-white text-xl" />
          <FaLinkedin className="text-white text-xl" />
        </div>
      </div>

      {/* Tab Menu */}
      <div className="flex justify-center mb-4 py-7">
  <div className="bg-white w-full rounded-lg shadow-md flex">
    <button
      onClick={() => setActiveTab("first")}
      className={`w-full py-2 px-4 transition-colors duration-300 ${
        activeTab === "first"
          ? "bg-blue-500 text-white"
          : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      Timeline
    </button>
    <button
      onClick={() => setActiveTab("second")}
      className={`w-full py-2 px-4  transition-colors duration-300 ${
        activeTab === "second"
          ? "bg-blue-500 text-white"
          : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      About
    </button>
    <button
      onClick={() => setActiveTab("third")}
      className={`w-full py-2 px-4  transition-colors duration-300 ${
        activeTab === "third"
          ? "bg-blue-500 text-white"
          : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      Friends
    </button>
    <button
      onClick={() => setActiveTab("forth")}
      className={`w-full py-2 px-4 transition-colors duration-300 ${
        activeTab === "forth"
          ? "bg-blue-500 text-white"
          : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      Photos
    </button>
  </div>
</div>


      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "first" && <div>
            <div className="min-h-screen bg-gray-100 text-gray-600 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Giới thiệu</h2>
          <p className="text-sm mt-2">"Perfectly imperfect"</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Sống tại Hưng Yên</li>
            <li>Tham gia vào Tháng 1 năm 2017</li>
            <li>Có 567 người theo dõi</li>
          </ul>
          <button className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">
            Chỉnh sửa chi tiết
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow-md">
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Photos</h2>
    <button className="text-blue-500 hover:underline text-sm">Add Photo</button>
  </div>

  {/* Photo Grid */}
  <div className="grid grid-cols-3 gap-4">
    <img
      src="https://randomuser.me/api/portraits/men/14.jpg"
      alt="Photo 1"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/9.jpg"
      alt="Photo 2"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/6.jpg"
      alt="Photo 3"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/15.jpg"
      alt="Photo 4"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/1.jpg"
      alt="Photo 5"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/52.jpg"
      alt="Photo 6"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/22.jpg"
      alt="Photo 7"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/5.jpg"
      alt="Photo 8"
      className="w-full h-auto rounded"
    />
    <img
      src="https://randomuser.me/api/portraits/men/66.jpg"
      alt="Photo 9"
      className="w-full h-auto rounded"
    />
  </div>
</div>

      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì?"
            className="w-full p-2 bg-gray-100 rounded text-sm"
          />
        </div>

        <div className="bg-white p-4 rounded shadow-md">
  {/* Header */}
  <div className="flex items-center mb-4">
    <img
      src="https://randomuser.me/api/portraits/men/1.jpg"
      alt="User"
      className="w-10 h-10 rounded-full"
    />
    <div className="ml-3">
      <h4 className="text-sm font-medium text-gray-800">Nguyễn Thanh Tùng</h4>
      <p className="text-xs text-gray-500">Add New Post · 3 hour ago</p>
    </div>
  </div>

  {/* Image */}
  <img
    src="https://phunugioi.com/wp-content/uploads/2020/04/nhung-hinh-anh-dep-ve-que-huong-dat-nuoc-con-nguoi-viet-nam.jpg"
    alt="Post"
    className="w-full rounded mb-4"
  />

  {/* Like, Comment, Share */}
  <div className="flex justify-between items-center text-gray-600 text-sm">
    <div className="flex space-x-2">
      <button className="flex items-center space-x-1">
        <span>👍</span>
        <span>140 Likes</span>
      </button>
      <button className="flex items-center space-x-1">
        <span>💬</span>
        <span>20 Comments</span>
      </button>
    </div>
    <button className="flex items-center space-x-1">
      <span>🔗</span>
      <span>99 Shares</span>
    </button>
  </div>

  <hr className="my-4" />

  {/* Comments */}
  <div className="space-y-4">
    <div className="flex items-start space-x-3">
      <img
        src="https://randomuser.me/api/portraits/men/13.jpg"
        alt="User"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <h5 className="text-sm font-medium text-gray-800">Monty Carlo</h5>
        <p className="text-xs text-gray-600">Anh Tùng đẹp trai</p>
        <div className="text-xs text-gray-500 flex space-x-2 mt-1">
          <button>Like</button>
          <button>Reply</button>
          <button>Translate</button>
          <span>5 min</span>
        </div>
      </div>
    </div>

    <div className="flex items-start space-x-3">
      <img
        src="https://randomuser.me/api/portraits/men/77.jpg"
        alt="User"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <h5 className="text-sm font-medium text-gray-800">Paul Molive</h5>
        <p className="text-xs text-gray-600">Anh Tùng đẹp trai</p>
        <div className="text-xs text-gray-500 flex space-x-2 mt-1">
          <button>Like</button>
          <button>Reply</button>
          <button>Translate</button>
          <span>5 min</span>
        </div>
      </div>
    </div>
  </div>

  <hr className="my-4" />

  {/* Add Comment */}
  <div className="flex items-center space-x-3">
    <img
      src="https://randomuser.me/api/portraits/men/13.jpg"
      alt="User"
      className="w-8 h-8 rounded-full"
    />
    <input
      type="text"
      placeholder="Enter Your Comment"
      className="flex-1 bg-gray-100 p-2 rounded text-sm"
    />
    <button>📎</button>
    <button>😊</button>
  </div>
</div>

      </div>
    </div>
        </div>}
        {activeTab === "second" && <div>About content goes here.</div>}
        {activeTab === "third" && <div>Friends content goes here.</div>}
        {activeTab === "forth" && <div>Photos content goes here.</div>}
      </div>
    </div>
  );
}

export default ProfilePage;
