import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar'; // Import Left Sidebar
import RightSidebar from './RightSidebar'; // Import Right Sidebar

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        {/* Left Sidebar */}
        <div className="w-1/6 bg-gray-200 p-4">
          <LeftSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-grow bg-white p-8">
          <Outlet /> {/* Render các component con */}
        </main>

        {/* Right Sidebar */}
        <div className="w-1/6 bg-gray-200 p-4">
          <RightSidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
