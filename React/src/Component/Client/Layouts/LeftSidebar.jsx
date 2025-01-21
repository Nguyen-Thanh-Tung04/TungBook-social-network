import React from "react";
import {
    FaUsers,
    FaChevronDown,
    FaFile,
    FaComments,
    FaCheckCircle,
    FaCalendarAlt,
    FaBirthdayCake,
    FaCloudSun,
    FaMusic,
    FaShoppingCart,
    FaBlog,
    FaBell,
} from "react-icons/fa"; // Các icon từ react-icons

function LeftSidebar() {
    return (
        <div className="bg-gray-100 w-full h-full min-h-screen p-4">
            <div className="mb-6">
                <h3 className="font-semibold text-blue-500">Hồ sơ </h3>
                <ul className="space-y-4 mt-2">
                    <a href="/profile">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaUsers className="mr-2" /> <span>Hồ sơ </span>
                        </li>
                    </a>
                    <a href="/friends">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaUsers className="mr-2" /> <span>Bạn bè </span>
                        </li>
                    </a>
                    <a href="/groups">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaUsers className="mr-2" /> <span>Nhóm </span>
                        </li>
                    </a>

                    {/* <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
            <FaBell className="mr-2" /> <span>Thông báo </span>
          </li> */}
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-blue-500">Đặc biệt</h3>
                <ul className="space-y-4 mt-2">
                    <a href="/chat">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaComments className="mr-2" />{" "}
                            <span>Tin nhắn</span>
                        </li>
                    </a>

                    <a href="/todo">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaCheckCircle className="mr-2" /> <span>Todo</span>
                        </li>
                    </a>

                    <a href="/calendar">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaCalendarAlt className="mr-2" />{" "}
                            <span>Calendar</span>
                        </li>
                    </a>

                    <a href="/birthday">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaBirthdayCake className="mr-2" />{" "}
                            <span>Birthday</span>
                        </li>
                    </a>

                    <a href="/weather">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaCloudSun className="mr-2" /> <span>Weather</span>
                        </li>
                    </a>

                    <a href="/marketplace">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaShoppingCart className="mr-2" />{" "}
                            <span>Market Place</span>
                        </li>
                    </a>

                    <a href="/blog">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <FaBlog className="mr-2" /> <span>Blog</span>
                        </li>
                    </a>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-blue-500">
                    Lối tắt của bạn{" "}
                </h3>
                <ul className="space-y-4 mt-2">
                    <a href="/group">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <img
                                src="https://baogiaothong.mediacdn.vn/upload/4-2022/images/2022-10-05/10-nha-khoa-hoc-vi-dai-nhat-moi-thoi-dai-1-1664953509-223-width740height681.jpg"
                                alt="Story Image 1"
                                className="w-10 h-10 object-cover rounded-lg"
                            />
                            <span className="px-3">Nhóm nhà bác học </span>
                        </li>
                    </a>
                    <a href="/group">
                        <li className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <img
                                src="https://baogiaothong.mediacdn.vn/upload/4-2022/images/2022-10-05/10-nha-khoa-hoc-vi-dai-nhat-moi-thoi-dai-1-1664953509-223-width740height681.jpg"
                                alt="Story Image 1"
                                className="w-10 h-10 object-cover rounded-lg"
                            />
                            <span className="px-3">Nhóm Hưng Yên</span>
                        </li>
                    </a>
                </ul>
            </div>
        </div>
    );
}

export default LeftSidebar;
