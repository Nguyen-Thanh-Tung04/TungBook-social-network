import React from "react";

function GroupsDetail() {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Banner */}
            <div className="relative">
                <img
                    src="https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg"
                    alt="Group Banner"
                    className="w-full h-80 object-cover"
                />
            </div>

            {/* Group Info */}
            <div className="bg-white shadow-md rounded-lg px-6 py-4 -mt-16 relative">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Nghiện AI</h1>
                        <p className="text-sm text-gray-500">
                            Nhóm Công khai · 51,1K thành viên
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700">
                            + Mời
                        </button>
                        <button className="bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                            Chia sẻ
                        </button>
                        <button className="bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                            Đã tham gia
                        </button>
                        <button className="bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                            ...
                        </button>
                    </div>
                </div>
                {/* Members */}
                <div className=" py-4">
                    <div className="flex items-center space-x-2">
                        {[...Array(15)].map((_, index) => (
                            <img
                                key={index}
                                src={`https://randomuser.me/api/portraits/thumb/men/${index}.jpg`}
                                alt="Thành viên"
                                className="w-8 h-8 rounded-full border border-white"
                            />
                        ))}
                        <span className="text-sm text-gray-500">+15</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-md mt-4 px-6 py-2">
                <nav className="flex space-x-6">
                    <button className="text-purple-600 font-semibold border-b-2 border-purple-600">
                        Thảo luận
                    </button>
                    <button className="text-gray-600 hover:text-purple-600">
                        Đáng chú ý
                    </button>
                    <button className="text-gray-600 hover:text-purple-600">
                        Mọi người
                    </button>
                    <button className="text-gray-600 hover:text-purple-600">
                        Sự kiện
                    </button>
                    <button className="text-gray-600 hover:text-purple-600">
                        File phương tiện
                    </button>
                    <button className="text-gray-600 hover:text-purple-600">
                        File
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default GroupsDetail;
