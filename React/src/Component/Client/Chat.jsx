import React, { useState } from 'react';
import { FaBell, FaChevronDown, FaComments, FaUsers, FaShoppingCart, FaBlog } from 'react-icons/fa'; // Các icon từ react-icons

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'User1', message: 'Hey, I am looking for the best admin template.', time: '6:48' },
    { sender: 'User2', message: 'Looks clean and fresh UI.', time: '6:52' },
    { sender: 'User1', message: 'I will purchase it for sure. 👍', time: '6:54' },
  ]);

  const handleSendMessage = () => {
    if (message) {
      setChatHistory([...chatHistory, { sender: 'You', message, time: new Date().toLocaleTimeString().slice(0, 5) }]);
      setMessage('');
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar phần Left */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex flex-col">
          {/* Thanh Header */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="font-semibold text-blue-500">Bni Jordan</h3>
            <span className="text-sm text-gray-500">Web Designer</span>
          </div>

          {/* Tìm kiếm */}
          <input
            type="text"
            className="w-full p-2 mb-4 rounded-lg border border-gray-300"
            placeholder="Search..."
          />

          {/* Kênh công khai */}
          <h3 className="font-semibold text-blue-500">Public Channels</h3>
          <ul className="space-y-4 mt-2">
            <li className="flex items-center">
              <FaBell className="mr-2" /> <span>Team Discussions</span>
            </li>
            <li className="flex items-center">
              <FaComments className="mr-2" /> <span>Announcement</span>
            </li>
          </ul>

          {/* Kênh riêng */}
          <h3 className="font-semibold text-blue-500 mt-6">Private Channels</h3>
          <ul className="space-y-4 mt-2">
            <li className="flex items-center">
              <FaUsers className="mr-2" /> <span>Designer</span>
            </li>
            <li className="flex items-center">
              <FaUsers className="mr-2" /> <span>Developer</span>
            </li>
          </ul>

          {/* Tin nhắn trực tiếp */}
          <h3 className="font-semibold text-blue-500 mt-6">Direct Message</h3>
          <ul className="space-y-4 mt-2">
            <li className="flex items-center">
              <FaUsers className="mr-2" /> <span>Paul Molive</span>
            </li>
            <li className="flex items-center">
              <FaUsers className="mr-2" /> <span>Paige Turner</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Khu vực Chat phần Right */}
      <div className="w-3/4 bg-blue-50 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-blue-500">Developer</h3>
          <button className="text-gray-500 text-sm flex items-center">
            <FaChevronDown className="mr-2" /> <span>Expand</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Hiển thị tin nhắn */}
          {chatHistory.map((chat, index) => (
            <div key={index} className="flex items-start my-3">
              <div className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white`}>
                {chat.sender[0]} {/* Hiển thị chữ cái đầu tiên của tên */}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <span className="font-semibold">{chat.sender}</span>
                  <span className="ml-2 text-gray-500 text-sm">{chat.time}</span>
                </div>
                <p className="text-gray-700">{chat.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nhập tin nhắn */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
