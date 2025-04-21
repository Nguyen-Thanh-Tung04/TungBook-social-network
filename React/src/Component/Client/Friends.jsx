import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Friends() {
    const [filter, setFilter] = useState("requests");
    const [search, setSearch] = useState("");
    const [friends, setFriends] = useState([]);

    // Fetch friends theo filter
    const fetchFriendsByFilter = async () => {
        try {
            let url = "http://localhost:8000/api/friends";

            if (filter === "suggestions") {
                url = "http://localhost:8000/api/friends/suggestions";
            } else if (filter === "requests") {
                url = "http://localhost:8000/api/friends/requests";
            }

            const res = await axios.get(url, {
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

    // Gọi lại khi filter thay đổi
    useEffect(() => {
        fetchFriendsByFilter();
    }, [filter]);

    // Lọc theo search
    const filteredFriends = friends.filter((friend) =>
        friend.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Chập nhận hoặc từ chối lời mời
    const handleAccept = async (requestId) => {
        try {
            await axios.put(`http://localhost:8000/api/friends/accept/${requestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            toast.success("Đã chấp nhận lời mời kết bạn!");
            setFriends((prev) =>
                prev.filter((friend) => friend.request_id !== requestId)
            );
        } catch (error) {
            console.error("Lỗi khi chấp nhận lời mời:", error);
        }
    };

    const handleReject = async (friendId) => {
        try {
            await axios.delete(`http://localhost:8000/api/friends/remove/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            setFriends((prev) =>
                prev.filter((friend) => friend.id !== friendId)
            );
        } catch (error) {
            console.error("Lỗi khi từ chối/hủy kết bạn:", error);
        }
    };


    // tab bạn bè 
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleFriendMenu = (id) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".friend-menu")) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Gửi lời mời kết bạn
    const handleSendFriendRequest = async (friendId) => {
        try {
          const res = await axios.post(
            `http://localhost:8000/api/friends/send/${friendId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                Accept: "application/json",
              },
            }
          );
          toast.success("✅ Đã gửi lời mời kết bạn!");
          // Cập nhật UI: ẩn khỏi danh sách gợi ý
          setFriends((prev) => prev.filter((f) => f.id !== friendId));
        } catch (error) {
          toast.error("❌ Lỗi khi gửi lời mời");
          console.error("Gửi lời mời thất bại:", error);
        }
      };

    // Gỡ gợi ý
    const handleRemoveSuggestion = (friendId) => {
        setFriends((prev) => prev.filter((f) => f.id !== friendId));
      };
      


    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-100" style={{ width: "50vw" }}>
            <h2 className="text-xl font-bold mb-6 mt-5">Danh sách bạn bè</h2>

            <div className="mb-4 flex items-center space-x-4">
                <button
                    className={`px-4 py-2 rounded ${filter === "requests" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setFilter("requests")}
                >
                    Lời mời kết bạn
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setFilter("all")}
                >
                    Tất cả bạn bè
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === "suggestions" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
                {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                        <div
                            key={friend.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-center"
                        >
                            <img
                                src={friend.avatar || "/storage/avatars/no-avatar.jpg"}
                                alt={friend.name}
                                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                            />
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{friend.name}</h3>
                                {!!friend.mutualFriends && (
                                    <p className="text-sm text-gray-500">
                                        {friend.mutualFriends} bạn chung
                                    </p>
                                )}
                            </div>

                            {friend.status === "pending" && (
                                <div className="flex justify-center space-x-2">
                                    <button
                                        className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-600"
                                        onClick={() => handleAccept(friend.request_id)}
                                    >
                                        Xác nhận
                                    </button>
                                    <button
                                        className="bg-red-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-red-600"
                                        onClick={() => handleReject(friend.id)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            )}


                            {friend.status === "accepted" && (
                                <div className="relative flex justify-center friend-menu">
                                    <button
                                        className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-600"
                                        onClick={() => toggleFriendMenu(friend.id)}
                                    >
                                        Bạn bè
                                    </button>

                                    {openMenuId === friend.id && (
                                        <div className="absolute top-12 bg-white border border-gray-200 rounded shadow-md z-10 w-40 text-sm">
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                onClick={() => {
                                                    toast.info("🚫 Đã hủy theo dõi!");
                                                    setOpenMenuId(null);
                                                }}
                                            >
                                                Hủy theo dõi
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                                onClick={async () => {
                                                    try {
                                                        await axios.delete(`http://localhost:8000/api/friends/remove/${friend.id}`, {
                                                            headers: {
                                                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                                                                Accept: "application/json",
                                                            },
                                                        });

                                                        toast.success("❌ Đã hủy kết bạn!");
                                                        setOpenMenuId(null);
                                                        await fetchFriendsByFilter(); // Gọi lại API
                                                    } catch (err) {
                                                        toast.error("Lỗi khi hủy kết bạn");
                                                        console.error(err);
                                                    }
                                                }}
                                            >
                                                Hủy kết bạn
                                            </button>
                                        </div>
                                    )}
                                </div>

                            )}

                            {friend.status === "suggested" && (
                                <div className="flex justify-center space-x-2">
                                    <button
                                        className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-600"
                                        onClick={() => handleSendFriendRequest(friend.id)}
                                    >
                                        Thêm bạn bè
                                    </button>
                                    <button
                                        className="bg-red-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-red-600"
                                        onClick={() => handleRemoveSuggestion(friend.id)}
                                    >
                                        Gỡ
                                    </button>
                                </div>
                            )}

                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10">
                        <div className="text-6xl mb-4">🤷</div>
                        <p className="text-lg font-medium">Không tìm thấy bạn bè nào</p>
                        <p className="text-sm text-gray-500">Hãy thử lại với từ khóa khác hoặc thay đổi bộ lọc.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Friends;
