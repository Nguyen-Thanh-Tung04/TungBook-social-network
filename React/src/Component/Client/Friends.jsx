import React, { useState } from "react";

const friendsData = [
    {
        id: 1,
        name: "Thanh Tâm",
        mutualFriends: 20,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: false,
    },
    {
        id: 2,
        name: "Nguyễn Thanh Lam",
        mutualFriends: 8,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: false,
    },
    {
        id: 3,
        name: "Đoàn Hoà",
        mutualFriends: 23,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: true,
    },
    {
        id: 4,
        name: "Nguyễn Thị Ngọc Anh",
        mutualFriends: 72,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: true,
    },
    {
        id: 5,
        name: "Nguyễn Hà",
        mutualFriends: 1,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: false,
    },
    {
        id: 6,
        name: "Nguyễn Văn Thái",
        mutualFriends: 28,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: false,
    },
    {
        id: 7,
        name: "Trà Vũ",
        mutualFriends: 15,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: true,
    },
    {
        id: 8,
        name: "Minh Hoàng",
        mutualFriends: 105,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: true,
    },
    {
        id: 9,
        name: "Ngọc Hà",
        mutualFriends: 27,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: false,
    },
    {
        id: 10,
        name: "Hồng Khuyên",
        mutualFriends: 21,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: true,
    },
    {
        id: 11,
        name: "Khanh Ly",
        mutualFriends: 3,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: false,
    },
    {
        id: 12,
        name: "Lưu Ánh Tuyết",
        mutualFriends: 47,
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
        isFriend: true,
    },
];

function Friends() {
    const [filter, setFilter] = useState("requests");
    const [search, setSearch] = useState("");

    const filteredFriends = friendsData
        .filter((friend) => {
            if (filter === "requests") return !friend.isFriend;
            if (filter === "all") return friend.isFriend;
            if (filter === "suggestions") return !friend.isFriend; // Lọc gợi ý
            return false;
        })
        .filter((friend) =>
            friend.name.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-100 min-h-screen"  >
            <h2 className="text-xl font-bold mb-6">Danh sách bạn bè</h2>

            <div className="mb-4 flex items-center space-x-4">
                <button
                    className={`px-4 py-2 rounded ${
                        filter === "requests"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                    onClick={() => setFilter("requests")}
                >
                    Lời mời kết bạn
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        filter === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                    onClick={() => setFilter("all")}
                >
                    Tất cả bạn bè
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        filter === "suggestions"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                    onClick={() => setFilter("suggestions")}
                >
                    Gợi ý
                </button>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="px-4 py-2 border border-gray-300 rounded w-full max-w-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredFriends.map((friend) => (
                    <div
                        key={friend.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-center"
                    >
                        <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                        />
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">
                                {friend.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {friend.mutualFriends} bạn chung
                            </p>
                        </div>
                        {!friend.isFriend && filter !== "suggestions" && (
                            <div className="flex justify-center space-x-2">
                                <button className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-600">
                                    Xác nhận
                                </button>
                                <button className="bg-red-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-red-600">
                                    Xóa
                                </button>
                            </div>
                        )}
                        {friend.isFriend && (
                            <div className="flex justify-center space-x-2">
                                <button className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-600">
                                    Bạn bè
                                </button>
                            </div>
                        )}
                        {filter === "suggestions" && (
                            <div className="flex justify-center space-x-2">
                                <button className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-600">
                                    Thêm bạn bè
                                </button>
                                <button className="bg-red-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-red-600">
                                    Gỡ
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Friends;
