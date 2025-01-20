import React from 'react';
import { FaUsers, FaFile, FaComments, FaCheckCircle, FaCalendarAlt, FaBirthdayCake, FaCloudSun, FaMusic, FaShoppingCart, FaBlog, FaBell } from 'react-icons/fa'; // Các icon từ react-icons

function LeftSidebar() {
  return (
    <div className="bg-gray-100 w-full h-full min-h-screen p-4">
      <div className="mb-6">
        <h3 className="font-semibold text-blue-500">SOCIAL</h3>
        <ul className="space-y-4 mt-2">
          <li className="flex items-center">
            <FaUsers className="mr-2" /> <span>Profiles</span>
          </li>
          <li className="flex items-center">
            <FaUsers className="mr-2" /> <span>Friend</span>
          </li>
          <li className="flex items-center">
            <FaUsers className="mr-2" /> <span>Group</span>
          </li>
          <li className="flex items-center">
            <FaBell className="mr-2" /> <span>Notification</span>
          </li>
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-blue-500">FEATURED</h3>
        <ul className="space-y-4 mt-2">
          <li className="flex items-center">
            <FaFile className="mr-2" /> <span>Files</span>
          </li>
          <li className="flex items-center">
            <FaComments className="mr-2" /> <span>Chat</span>
          </li>
          <li className="flex items-center">
            <FaCheckCircle className="mr-2" /> <span>Todo</span>
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="mr-2" /> <span>Calendar</span>
          </li>
          <li className="flex items-center">
            <FaBirthdayCake className="mr-2" /> <span>Birthday</span>
          </li>
          <li className="flex items-center">
            <FaCloudSun className="mr-2" /> <span>Weather</span>
          </li>
          <li className="flex items-center">
            <FaMusic className="mr-2" /> <span>Music</span>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-blue-500">OTHER PAGES</h3>
        <ul className="space-y-4 mt-2">
          <li className="flex items-center">
            <FaShoppingCart className="mr-2" /> <span>Market Place</span>
          </li>
          <li className="flex items-center">
            <FaBlog className="mr-2" /> <span>Blog</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
