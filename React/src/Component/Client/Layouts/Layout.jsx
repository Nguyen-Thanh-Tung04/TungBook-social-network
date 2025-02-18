import React from "react";
import { useLocation } from "react-router-dom"; 
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar"; 
import RightSidebar from "./RightSidebar";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/regester" || location.pathname === "/forgot-password" || location.pathname === "/profile" || location.pathname === "/story-up";
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="flex flex-col h-screen max-w-full mx-auto">
      {/* Header cố định */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </header>

      <div className="flex flex-grow pt-[64px] overflow-hidden">
        {/* Left Sidebar (chỉ hiện khi không phải trang Chat hoặc Auth Page) */}
        {!isAuthPage && !isChatPage && (
          <aside className="hidden lg:block lg:w-1/5 bg-gray-200 p-4 h-full overflow-y-auto">
            <LeftSidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <main 
          className={`flex-grow flex ${isChatPage ? "overflow-hidden" : "overflow-y-auto justify-center"} 
          ${isAuthPage || isChatPage ? "mx-auto max-w-full" : "px-4"}`}>
          <Outlet /> {/* Đây là nơi trang Chat sẽ được render */}
        </main>

        {/* Right Sidebar (chỉ hiện khi không phải trang Chat hoặc Auth Page) */}
        {!isAuthPage && !isChatPage && (
          <aside className="hidden lg:block lg:w-1/5 bg-gray-200 p-4 h-full overflow-y-auto">
            <RightSidebar />
          </aside>
        )}
      </div>

      {/* Footer (chỉ hiển thị khi kéo xuống hết trang) */}
      {/* {!isChatPage && <Footer />} */}
    </div>
  );
};

export default Layout;
