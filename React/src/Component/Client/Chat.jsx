import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaUserCircle,
  FaBell,
  FaPlus,
  FaImage,
  FaGlobe,
  FaSmile,
} from "react-icons/fa";

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setFriends(res.data.friends || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bạn bè:", error);
    }
  };

  const selectChat = async (friend, index) => {
    setActiveTab(index);
    setCurrentChat(friend);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/messages/${friend.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải tin nhắn:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!message || !currentChat?.id) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/messages`,
        {
          receiver_id: currentChat.id,
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setMessages([...messages, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Không gửi được tin nhắn", err);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100 p-2">
      {/* Sidebar left */}
      <div className="w-1/3 border-r border-gray-300 flex flex-col h-full">
        <div className="p-4">
          <h1 className="font-bold text-2xl">Đoạn chat</h1>
        </div>
        <div className="p-4 bg-gray-100">
          <input
            type="text"
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="Tìm kiếm trên Messenger"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <h3 className="font-semibold text-gray-600">Hộp thư</h3>
          <ul className="mt-4">
            {friends.map((friend, index) => (
              <li
                key={friend.id}
                className={`flex items-center py-2 cursor-pointer ${activeTab === index ? "bg-gray-200" : ""
                  }`}
                onClick={() => selectChat(friend, index)}
              >
                <img
                  src={friend.avatar || "/storage/avatars/no-avatar.jpg"}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="ml-4 text-gray-800">
                  {friend.username || friend.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center">
            {currentChat ? (
              <img
                src={currentChat.avatar || "/storage/avatars/no-avatar.jpg"}
                alt={currentChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            )}
            <span className="ml-4 font-semibold text-gray-800">
              {currentChat?.username || currentChat?.name || "Chọn người để chat"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <FaPhone className="text-gray-600" />
            <FaVideo className="text-gray-600" />
            <FaInfoCircle className="text-gray-600" />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messages.map((chat, index) => (
            <div
              key={index}
              className={`mb-4 ${chat.sender_id === currentChat?.id ? "text-left" : "text-right"
                }`}
            >
              <div className="inline-block max-w-xs p-2 rounded-lg bg-gray-200">
                <span className="text-gray-800">{chat.content}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(chat.created_at).toLocaleTimeString().slice(0, 5)}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-300 flex items-center w-full bg-white relative bottom-14">
          <div className="flex space-x-3 text-blue-500 px-2">
            <FaPlus className="text-xl cursor-pointer" />
            <FaImage className="text-xl cursor-pointer" />
            <FaGlobe className="text-xl cursor-pointer" />
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 mx-3 p-2 rounded-full border border-gray-300 bg-gray-100 text-gray-800 outline-none placeholder-gray-500"
            placeholder="Aa"
          />
          <div className="flex space-x-3 text-blue-500 px-2">
            <FaSmile className="text-xl cursor-pointer" />
          </div>
          <button
            onClick={handleSendMessage}
            className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Gửi
          </button>
        </div>
      </div>

      {/* Sidebar Right */}
      <div className="w-1/4 border-l border-gray-300 flex flex-col h-full p-4 pb-5 text-black">
        <div className="flex flex-col items-center">
          {currentChat ? (
            <img
              src={currentChat.avatar || "/storage/avatars/no-avatar.jpg"}
              alt={currentChat.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300"></div>
          )}
          <h2 className="text-xl font-bold mt-2">
            {currentChat?.username || currentChat?.name || "..."}
          </h2>
          <p className="text-gray-400 text-sm">
            {currentChat ? "Đang hoạt động" : ""}
          </p>
        </div>

        <div className="flex justify-around mb-4">
          <button className="flex flex-col items-center text-gray-400 hover:text-white">
            <FaUserCircle size={20} />
            <span className="text-xs mt-1">Trang cá nhân</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-white">
            <FaBell size={20} />
            <span className="text-xs mt-1">Tắt thông báo</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-white">
            <FaSearch size={20} />
            <span className="text-xs mt-1">Tìm kiếm</span>
          </button>
        </div>

        <hr className="my-4 border-gray-600" />

        <div className="flex flex-col space-y-4 overflow-y-auto flex-1">
          <button className="flex justify-between items-center bg-gray-300 text-white py-2 px-4 rounded-lg">
            Thông tin về đoạn chat <span>⌄</span>
          </button>
          <button className="flex justify-between items-center bg-gray-300 text-white py-2 px-4 rounded-lg">
            Tùy chỉnh đoạn chat <span>⌄</span>
          </button>
          <button className="flex justify-between items-center bg-gray-300 text-white py-2 px-4 rounded-lg">
            File phương tiện, file và liên kết <span>⌄</span>
          </button>
          <button className="flex justify-between items-center bg-gray-300 text-white py-2 px-4 rounded-lg">
            Quyền riêng tư và hỗ trợ <span>⌄</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
