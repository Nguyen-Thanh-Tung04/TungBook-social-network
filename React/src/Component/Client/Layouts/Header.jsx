import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBell, FaFacebookMessenger } from "react-icons/fa"; // Các icon từ react-icons

const Header = () => {
  const isLoggedIn = !!localStorage.getItem("authToken"); // Check if user is logged in
  const navigate = useNavigate(); // Hook to navigate to other pages
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle avatar dropdown menu
  const [notificationOpen, setNotificationOpen] = useState(false); // State to toggle notification menu
  const notificationRef = useRef(null); // Ref for the notification menu

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token in the header
          },
        }
      );

      if (response.data.message === "Logout successful") {
        localStorage.removeItem("authToken"); // Remove the token from localStorage
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen); // Toggle avatar menu
  const toggleNotification = () => setNotificationOpen(!notificationOpen); // Toggle notification menu

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 shadow-md px-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight">
          <a href="/home">TungBook</a>
        </h1>

        {/* Search Input */}
        <div className="flex-grow mx-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 py-2 px-4 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex items-center space-x-6">
            {/* If Logged In */}
            {isLoggedIn && (
              <>
                {/* Chat Icon */}
                <a href="/chat">
                  <li className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition">
                    <FaFacebookMessenger className="text-black text-xl" />
                  </li>
                </a><li className="relative" ref={notificationRef}>
  <div
    className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition"
    onClick={toggleNotification}
  >
    <FaBell className="text-black text-xl" />
  </div>
  {notificationOpen && (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-black">Thông báo</h3>
        <div className="flex justify-between items-center text-sm text-black">
          <button className="text-blue-500 font-medium">Tất cả</button>
          <button className="hover:underline text-gray-700">Chưa đọc</button>
        </div>
      </div>

      {/* Notification List */}
      <ul className="max-h-96 overflow-y-auto">
        {/* Sample Notification */}
        <li className="p-4 hover:bg-gray-100 cursor-pointer flex items-start">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-sm text-black">
              <span className="font-medium">Chào mừng bạn</span> đến với cộng
              đồng của chúng tôi.
            </p>
            <span className="text-xs text-gray-600">14 giờ trước</span>
          </div>
        </li>
        <li className="p-4 hover:bg-gray-100 cursor-pointer flex items-start">
          <img
            src="https://randomuser.me/api/portraits/men/2.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-sm text-black">
              <span className="font-medium">Trần Nhật Duy</span> thích bài viết
              của bạn.
            </p>
            <span className="text-xs text-gray-600">19 giờ trước</span>
          </div>
        </li>
      </ul>

      {/* View All Notifications */}
      <div className="p-4 text-center border-t border-gray-300">
        <button className="text-blue-500 hover:underline text-sm">
          Xem tất cả
        </button>
      </div>
    </div>
  )}
</li>


                {/* Bell Icon for Notifications */}
               

                {/* Avatar and Dropdown Menu */}
                <li className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full cursor-pointer border-4 border-white"
                    onClick={toggleMenu} // Toggle avatar menu
                  />
                  {menuOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
                      <li>
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Hồ sơ tài khoản
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            )}

            {/* If Not Logged In */}
            {!isLoggedIn && (
              <>
                <li>
                  <a
                    href="/login"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Đăng nhập
                  </a>
                </li>
                <li>
                  <a
                    href="/regester"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Đăng ký
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
