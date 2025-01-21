import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar"; // Import Left Sidebar
import RightSidebar from "./RightSidebar"; // Import Right Sidebar

const Layout = () => {
  const location = useLocation(); // Lấy thông tin URL hiện tại

  // Kiểm tra nếu người dùng đang ở trang đăng nhập hoặc đăng ký
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/regester" || location.pathname === "/chat";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        {/* Left Sidebar */}
        {!isAuthPage && (
          <div className="w-1/6 bg-gray-200 p-4">
            <LeftSidebar />
          </div>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-grow bg-white p-8 ${
            isAuthPage ? "mx-auto max-w-md" : ""
          }`}
        >
          <Outlet /> {/* Render các component con */}
        </main>

        {/* Right Sidebar */}
        {!isAuthPage && (
          <div className="w-1/6 bg-gray-200 p-4">
            <RightSidebar />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
