import React, { useState } from "react";
import { FaSearch, FaPhone, FaVideo, FaInfoCircle } from "react-icons/fa";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0); // State để lưu tab đang được chọn
  const chatData = [
    {
      name: "dunglon 200",
      history: [
        { sender: "dunglon 200", message: "Kieuer h áy", time: "07:45" },
        { sender: "dunglon 200", message: "Xem giao ch", time: "07:46" },
        { sender: "dunglon 200", message: "Chụp t xem vs", time: "07:47" },
        { sender: "You", message: "hủy thôi đợi gì nữa", time: "07:50" },
      ],
    },
    {
      name: "Tab 2",
      history: [
        { sender: "Tab 2", message: "Hi, how are you?", time: "08:00" },
        { sender: "You", message: "I'm fine, thanks!", time: "08:05" },
      ],
    },
    {
      name: "Tab 3",
      history: [
        { sender: "Tab 3", message: "What's the update?", time: "09:15" },
        { sender: "You", message: "Working on it!", time: "09:20" },
      ],
    },
  ];
  const currentChat = chatData[activeTab]; // Lấy dữ liệu chat của tab hiện tại

  const handleSendMessage = () => {
    if (message) {
      const updatedChat = {
        ...currentChat,
        history: [
          ...currentChat.history,
          { sender: "You", message, time: new Date().toLocaleTimeString().slice(0, 5) },
        ],
      };
      chatData[activeTab] = updatedChat; // Cập nhật dữ liệu của tab hiện tại
      setMessage(""); // Xóa message sau khi gửi
    }
  };

  return (
    <div className="flex w-full h-[88vh] bg-gray-100">
    {/* Sidebar */}
    <div className="w-1/3 border-r border-gray-300 flex flex-col">
      <div className="p-4">
        <h1 className="font-bold text-2xl">Đoạn chat</h1>
      </div>
      <div className="p-4 sticky top-0 bg-gray-100 z-10">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          placeholder="Tìm kiếm trên Messenger"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="font-semibold text-gray-600">Hộp thư</h3>
        <ul className="mt-4">
          {chatData.map((chat, index) => (
            <li
              key={index}
              className={`flex items-center py-2 cursor-pointer ${
                activeTab === index ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab(index)} // Chuyển tab khi click
            >
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <span className="ml-4 text-gray-800">{chat.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  
    {/* Chat Area */}
    <div className="w-2/3 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <span className="ml-4 font-semibold text-gray-800">{currentChat.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaPhone className="text-gray-600" />
          <FaVideo className="text-gray-600" />
          <FaInfoCircle className="text-gray-600" />
        </div>
      </div>
  
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white h-0">
        {currentChat.history.map((chat, index) => (
          <div key={index} className={`mb-4 ${chat.sender === "You" ? "text-right" : "text-left"}`}>
            <div className="inline-block max-w-xs p-2 rounded-lg bg-gray-200">
              <span className="text-gray-800">{chat.message}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">{chat.time}</div>
          </div>
        ))}
      </div>
  
      {/* Message Input */}
      <div className="p-4 border-t border-gray-300 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300"
          placeholder="Aa"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Gửi
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Chat;
