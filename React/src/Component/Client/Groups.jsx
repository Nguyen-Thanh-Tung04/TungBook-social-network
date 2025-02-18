import React, { useState } from "react";

function Groups() {
    // Danh sách các nhóm giả lập
    const groups = [
        {
            id: 1,
            name: "Tuyển dụng thực tập IT",
            lastAccess: "22 tuần trước",
            image: "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
            joined: true,
            members: [
                { avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
                { avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
                { avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
            ],
        },
        {
            id: 2,
            name: "Code Đồ Án Công Nghệ Thông Tin (CNTT) & Lập Trình Web",
            lastAccess: "26 tuần trước",
            image: "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
            joined: true,
            members: [
                { avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
                { avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            ],
        },
        ,
        {
            id: 3,
            name: "Code Đồ Án Công Nghệ Thông Tin (CNTT) & Lập Trình Web",
            lastAccess: "26 tuần trước",
            image: "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
            joined: true,
            members: [
                { avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
                { avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            ],
        },
        ,
        {
            id: 4,
            name: "Code Đồ Án Công Nghệ Thông Tin (CNTT) & Lập Trình Web",
            lastAccess: "26 tuần trước",
            image: "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
            joined: true,
            members: [
                { avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
                { avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            ],
        },
        {
            id: 5,
            name: "KHU PHỐ FREELANCER",
            lastAccess: "21 tuần trước",
            image: "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
            joined: false,
            members: [
                { avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
                { avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            ],
        },
        {
            id: 6,
            name: "Hưng Yên 89 ",
            lastAccess: "21 tuần trước",
            image: "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
            joined: false,
            members: [
                { avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
                { avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            ],
        },
    ];

    const [filter, setFilter] = useState("joined");
    const [search, setSearch] = useState("");

    const filteredGroups = groups
        .filter((group) => {
            if (filter === "joined") return group.joined;
            if (filter === "notJoined") return !group.joined;
            return true;
        })
        .filter((group) =>
            group.name.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <div className="bg-gray-100 min-h-screen p-6" style={{ width: "50vw" }}>
                <h2 className="text-lg font-semibold mb-4">
                    Tất cả các nhóm ({filteredGroups.length})
                </h2>
                <div className="mb-4 flex items-center space-x-4">
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            filter === "joined"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setFilter("joined")}
                    >
                        Nhóm đã tham gia
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            filter === "notJoined"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setFilter("notJoined")}
                    >
                        Gợi ý
                    </button>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <a href="/groups/:id">
                    <div className="grid grid-cols-3 gap-4">
                        {filteredGroups.map((group) => (
                            <div
                                key={group.id}
                                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center max-w-[300px]"
                                style={{ width: "100%" }}
                            >
                                <img
                                    src={group.image}
                                    alt={group.name}
                                    className="w-80 h-52 object-cover rounded-lg mb-2"
                                />
                                <h3 className="text-sm font-semibold text-gray-800 text-center">
                                    {group.name}
                                </h3>
                                <span className="text-sm text-gray-500 mb-2">
                                    Thành viên: {group.members.length}
                                </span>
                                <p className="text-sm text-gray-500 mb-4">
                                    Bài đăng: 200
                                </p>
        
                                {/* Hiển thị danh sách ảnh thành viên */}
                                <div className="flex -space-x-2 mb-4">
                                    {group.members.length > 0 ? (
                                        group.members.map((member, index) => (
                                            <img
                                                key={index}
                                                src={member.avatar}
                                                alt="Thành viên"
                                                className="w-8 h-8 border-2 border-white rounded-full object-cover"
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            Không có thành viên
                                        </p>
                                    )}
                                </div>
        
                                {/* Hiển thị nút theo trạng thái tham gia */}
                                <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600">
                                    {group.joined ? "Xem nhóm" : "Tham gia nhóm"}
                                </button>
                            </div>
                        ))}
                    </div>
                </a>
            </div>
        );
        
}

export default Groups;
