import React from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

function StoryDetail() {
    const stories = [
        {
            name: "Anh Nam",
            time: "5 giờ",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            name: "Phạm Thị Thu Hà",
            time: "6 giờ",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            name: "Tra My",
            time: "1 giờ",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
            name: "Đinh Hạ Vi",
            time: "2 giờ",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
            name: "Duyên Duyên",
            time: "1 giờ",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        },
    ];

    return (
        <div className="flex h-screen bg-gray-900 text-white" >
            {/* Sidebar (Danh sách tin) */}
            <div className="w-1/4 bg-gray-900 p-4">
                <h2 className="text-lg font-semibold mb-4">Tin</h2>
                <div>
                    <div className="flex items-center mb-6">
                        <img
                            src="https://randomuser.me/api/portraits/men/2.jpg"
                            alt="Your Story"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="font-semibold">Nguyễn Thanh Tùng</p>
                            <p className="text-sm text-gray-400">
                                1 thẻ mới · 16 giờ
                            </p>
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-400 mb-4">Tất cả tin</h3>
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            className="flex items-center mb-4 cursor-pointer hover:bg-gray-800 p-2 rounded-lg"
                        >
                            <img
                                src={story.avatar}
                                alt={story.name}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-semibold">{story.name}</p>
                                <p className="text-sm text-gray-400">
                                    {story.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Content */}
            <div className="flex-1 flex flex-col items-center p-4">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-4 relative">
                    <div className="flex items-center">
                        <img
                            src="https://randomuser.me/api/portraits/men/1.jpg"
                            alt="Story Owner"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="font-semibold">Anh Tùng</p>
                            <p className="text-sm text-gray-400">5 giờ</p>
                        </div>
                        {/* Icon Close ở góc phải */}
                    </div>

                    <button
                        onClick={() => window.history.back()} // Quay lại trang trước
                        className="absolute right-4  transform   text-white hover:text-gray-300"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                </div>


                {/* Images */}
                <div className="relative w-full flex flex-col gap-4">
                    {/* Nút Sang Trái */}
                    <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                        <FaChevronLeft className="text-lg" />
                    </button>

                    {/* Hình Ảnh */}
                    <img
                        src="https://baogiaothong.mediacdn.vn/upload/4-2022/images/2022-10-05/10-nha-khoa-hoc-vi-dai-nhat-moi-thoi-dai-1-1664953509-223-width740height681.jpg"
                        alt="Story Image 1"
                        className="w-full h-auto object-cover rounded-lg"
                        style={{ height: "500px" }}
                    />

                    {/* Nút Sang Phải */}
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                        <FaChevronRight className="text-lg" />
                    </button>
                </div>

                {/* Footer */}
                <div className="w-full flex items-center justify-between mt-4">
                    <input
                        type="text"
                        placeholder="Trả lời..."
                        className="flex-1 bg-gray-800 text-gray-300 p-2 rounded-lg mr-4"
                    />
                    <div className="flex space-x-2">
                        <button className="text-gray-400">👍</button>
                        <button className="text-gray-400">❤️</button>
                        <button className="text-gray-400">😮</button>
                        <button className="text-gray-400">😢</button>
                        <button className="text-gray-400">😡</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoryDetail;
