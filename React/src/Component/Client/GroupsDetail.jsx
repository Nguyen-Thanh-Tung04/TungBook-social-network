import React from "react";

const GroupsDetail = () => {
    const posts = [
        {
            user: {
                name: "Nguyễn Thanh Tùng",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            content: "Lao động là vinh quang.",
            image: "https://phunugioi.com/wp-content/uploads/2020/04/nhung-hinh-anh-dep-ve-que-huong-dat-nuoc-con-nguoi-viet-nam.jpg",
            likes: 140,
            comments: 20,
            shares: 99,
        },
        {
            user: {
                name: "Anna Sthesia",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi.",
            images: [
                "https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU",
            ],
            likes: 140,
            comments: 20,
            shares: 99,
        },
        {
            user: {
                name: "Anna Sthesia",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi.",
            images: [
                "https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTo0RlA5zJ3VvRDHgKsL1y2hyckhuebXhePOoLWF8fiN8hsBnbgwWaCUsMnbJNxLisZBQ&usqp=CAU",
            ],
            likes: 140,
            comments: 20,
            shares: 99,
        },
    ];

    return (
        <div className=" min-h-screen" style={{ width: "50vw" }}>
            <main className="bg-gray-100">
   {/* Banner */}
   <div className="relative">
                <img
                    src="https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg"
                    alt="Group Banner"
                    className="w-full h-80 object-cover"
                />
            </div>

            {/* Group Info */}
            <div className="bg-white shadow-md rounded-lg  py-4 -mt-16 relative">
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
                <div className="py-4">
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

            {/* Posts */}
            {/* Posts */}
            <div className="mt-6 px-6 space-y-6">
                {posts.map((post, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded shadow-md max-w-[750px] mx-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center mb-4">
                            <img
                                src={post.user.avatar}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-gray-800">
                                    {post.user.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Add New Post · 3 hour ago
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-gray-700 mb-4">
                            {post.content}
                        </p>

                        {/* Image Section */}
                        {post.image && (
                            <div className="rounded overflow-hidden max-h-[400px]">
                                <img
                                    src={post.image}
                                    alt="Post"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {post.images && post.images.length === 3 && (
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {/* Ảnh lớn bên trái */}
                                <div className="col-span-2">
                                    <img
                                        src={post.images[0]}
                                        alt="Large Image"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                {/* 2 ảnh nhỏ bên phải */}
                                <div className="grid grid-rows-2 gap-4">
                                    <img
                                        src={post.images[1]}
                                        alt="Small Image 1"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <img
                                        src={post.images[2]}
                                        alt="Small Image 2"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {post.images && post.images.length !== 3 && (
                            <div className="grid grid-cols-2 gap-4">
                                {post.images.map((image, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded overflow-hidden max-h-[200px]"
                                    >
                                        <img
                                            src={image}
                                            alt={`Post ${idx + 1}`}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Like, Comment, Share */}
                        <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
                            <div className="flex space-x-2">
                                <button className="flex items-center space-x-1">
                                    <span>👍</span>
                                    <span>{post.likes} Likes</span>
                                </button>
                                <button className="flex items-center space-x-1">
                                    <span>💬</span>
                                    <span>{post.comments} Comments</span>
                                </button>
                            </div>
                            <button className="flex items-center space-x-1">
                                <span>🔗</span>
                                <span>{post.shares} Shares</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            </main>
         
        </div>
    );
};

export default GroupsDetail;
