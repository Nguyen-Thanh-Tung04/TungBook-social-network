import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Header = () => {
  const isLoggedIn = localStorage.getItem('authToken'); // Check if user is logged in
  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include the token in the header
        }
      });

      if (response.data.message === 'Logout successful') {
        localStorage.removeItem('authToken'); // Remove the token from localStorage
        navigate('/login'); // Redirect to home page or login page
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 shadow-md px-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight"><a href="/home">TungBook</a></h1>

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
          <ul className="flex space-x-6">
            {isLoggedIn && (
              <li>
                <a href="/profile" className="hover:text-gray-200 transition duration-200"> <img
                src="https://randomuser.me/api/portraits/men/1.jpg" // Avatar người dùng
                alt="User Avatar"
                className="w-12 h-12 rounded-full border-4 border-white"
              /></a>
              </li>
            )}
            
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 transition duration-200"
                >
                  Đăng xuất
                </button>
              </li>
            ) : (
              <>
                <li>
                  <a href="/login" className="hover:text-gray-200 transition duration-200">Đăng nhập</a>
                </li>
                <li>
                  <a href="/regester" className="hover:text-gray-200 transition duration-200">Đăng ký</a>
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
