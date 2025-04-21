import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCog } from "react-icons/fa";

function RightSidebar() {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/friends", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        Accept: "application/json",
                    },
                });
                setFriends(res.data.friends);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bạn bè:", error);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div className="bg-gray-100 w-full h-full p-4">
            <div className="space-y-6">
                {friends.map((friend) => (
                    <a href={`/user/${friend.id}`} key={friend.id}>
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-lg">
                            <div className="relative">
                                <img
                                    src={friend.avatar || "/storage/avatars/no-avatar.jpg"}
                                    alt={friend.name}
                                    className="w-12 h-12 rounded-full border-2 border-green-500"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
                            </div>
                            <div className="ml-3">
                                <div className="font-semibold">{friend.name}</div>
                                <div className="text-sm text-gray-500">Bạn bè</div>
                            </div>
                        </div>
                    </a>
                ))}

                {/* Nút cài đặt */}
                <div className="flex justify-end mt-4">
                    <FaCog className="text-gray-500 cursor-pointer hover:text-gray-700" />
                </div>
            </div>
        </div>
    );
}

export default RightSidebar;
