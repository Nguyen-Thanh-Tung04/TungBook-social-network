// Import các thư viện cần thiết
import React, { useState } from "react";
import { FaVideo, FaPhotoVideo, FaSmile } from "react-icons/fa"; // Import các icon cần dùng
import axios from "axios";
import { IoSend } from "react-icons/io5"; // Đúng thư viện


const Home = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image); // Đặt ảnh được click vào state
    };

    const closeImageViewer = () => {
        setSelectedImage(null); // Đóng chế độ xem ảnh
    };

    // Bình luận
    const [showCommentsModal, setShowCommentsModal] = useState(false);

    // Đăng bài
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postContent, setPostContent] = useState(""); // Dùng để lưu nội dung bài viết
    const [file, setFile] = useState(null); // Dùng để lưu file tải lên

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const [files, setFiles] = useState([]); // Thay vì 1 file, lưu danh sách file

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            (file) => file instanceof File
        );
        setFiles(selectedFiles); // Lưu file trực tiếp
    };
    const handleRemoveImage = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", 1);
        formData.append("type_id", 1);
        formData.append("content", postContent);

        // Lặp qua danh sách file và thêm vào formData
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/posts",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Response từ server:", response.data);
            toggleModal();
        } catch (error) {
            console.error(
                "Lỗi khi gửi request:",
                error.response ? error.response.data : error
            );
        }
    };

    const friendsStories = [
        {
            name: "Nguyễn Thanh Tùng ",
            img: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            name: "Đỗ  Oanh ",
            img: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            name: "Phạm Hà",
            img: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            name: "Cảnh keng ",
            img: "https://randomuser.me/api/portraits/women/2.jpg",
        },
    ];

    const fakePosts = [
        {
            id: 1,
            user: {
                name: "Anna Sthesia",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg"
            },
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            images: ["https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg"],
            likes: 140,
            likedBy: [
                { name: "Trần Minh Điện", avatar: "https://randomuser.me/api/portraits/men/10.jpg", mutualFriends: "1 bạn chung" },
                { name: "Bùi Thơm", avatar: "https://randomuser.me/api/portraits/women/11.jpg", mutualFriends: "1 bạn chung" },
                { name: "Đào Huyền", avatar: "https://randomuser.me/api/portraits/women/12.jpg", mutualFriends: null },
                { name: "Nguyễn Văn B", avatar: "https://randomuser.me/api/portraits/men/15.jpg", mutualFriends: "3 bạn chung" },
                { name: "Lê Thị C", avatar: "https://randomuser.me/api/portraits/women/16.jpg", mutualFriends: "2 bạn chung" },
                { name: "Trương Văn D", avatar: "https://randomuser.me/api/portraits/men/17.jpg", mutualFriends: null }
            ],
            comments: [
                {
                    user: {
                        name: "John Doe",
                        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
                    },
                    text: "Great post!"
                },
                {
                    user: {
                        name: "Jane Smith",
                        avatar: "https://randomuser.me/api/portraits/women/2.jpg"
                    },
                    text: "Thanks for sharing!"
                }
            ],
            shares: 99,
        },
        {
            id: 2,
            user: {
                name: "Anna Sthesia",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg"
            },
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            images: [
                "https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU"
            ],
            likes: 200, // Fake số like
            likedBy: [
                { name: "Lê Minh", avatar: "https://randomuser.me/api/portraits/men/20.jpg", mutualFriends: "2 bạn chung" },
                { name: "Phạm Hạnh", avatar: "https://randomuser.me/api/portraits/women/21.jpg", mutualFriends: "1 bạn chung" },
                { name: "Nguyễn An", avatar: "https://randomuser.me/api/portraits/men/22.jpg", mutualFriends: "4 bạn chung" },
                { name: "Trần Văn C", avatar: "https://randomuser.me/api/portraits/men/23.jpg", mutualFriends: null },
                { name: "Hoàng My", avatar: "https://randomuser.me/api/portraits/women/24.jpg", mutualFriends: "5 bạn chung" }
            ],
            comments: [
                {
                    user: {
                        name: "Alice Johnson",
                        avatar: "https://randomuser.me/api/portraits/women/3.jpg"
                    },
                    text: "This is amazing!"
                }
            ],
            shares: 120,
        },
        {
            id: 3,
            user: {
                name: "Anna Sthesia",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg"
            },
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            images: [
                "https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTo0RlA5zJ3VvRDHgKsL1y2hyckhuebXhePOoLWF8fiN8hsBnbgwWaCUsMnbJNxLisZBQ&usqp=CAU"
            ],
            likes: 300, // Fake số like
            likedBy: [
                { name: "Trịnh Hùng", avatar: "https://randomuser.me/api/portraits/men/30.jpg", mutualFriends: "3 bạn chung" },
                { name: "Đặng Lan", avatar: "https://randomuser.me/api/portraits/women/31.jpg", mutualFriends: null },
                { name: "Võ Tuấn", avatar: "https://randomuser.me/api/portraits/men/32.jpg", mutualFriends: "6 bạn chung" },
                { name: "Mai Thanh", avatar: "https://randomuser.me/api/portraits/women/33.jpg", mutualFriends: "2 bạn chung" },
                { name: "Ngô Phương", avatar: "https://randomuser.me/api/portraits/women/34.jpg", mutualFriends: "1 bạn chung" },
                { name: "Dương Đức", avatar: "https://randomuser.me/api/portraits/men/35.jpg", mutualFriends: null }
            ],
            comments: [],
            shares: 150,
        }
    ];

    const [selectedPostId, setSelectedPostId] = useState(null);

    const [showLikesModal, setShowLikesModal] = useState(false);

    const openLikesModal = (postId) => {
        setSelectedPostId(postId);
        setShowLikesModal(true);
    };

    const selectedPost = fakePosts.find(post => post.id === selectedPostId);

    const openCommentsModal = (postId) => {
        setSelectedPostId(postId);
        setShowCommentsModal(true);
        window.scrollTo({ top: 0, behavior: "smooth" });  // Cuộn lên đầu trang
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="" style={{ width: "50vw" }}>
            <main className="container mx-auto px-9 py-8 max-w-[1005px] bg-gray-200 ">
                {/* Thanh trạng thái */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex items-center">
                        <img
                            src="https://randomuser.me/api/portraits/men/3.jpg"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="relative w-full ">
                            {/* Input mở modal */}
                            <input
                                type="text"
                                placeholder="Tùng ơi, bạn đang nghĩ gì thế?"
                                className="flex-1 p-2 bg-gray-200 w-full text-gray-300 rounded-lg focus:outline-none border-none"
                                onClick={toggleModal}
                            />

                            {/* Modal */}
                            {isModalOpen && (
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                                    onClick={toggleModal}
                                >
                                    <div
                                        className="bg-white rounded-lg p-6 w-3/6 max-h-[80vh] overflow-y-auto relative"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Nút đóng Modal */}
                                        <button
                                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                                            onClick={toggleModal}
                                        >
                                            ❌
                                        </button>
                                        <div className="flex items-center mb-4">
                                            <img
                                                src="https://randomuser.me/api/portraits/men/1.jpg"
                                                alt="User"
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <h4 className="text-sm font-medium text-gray-800">
                                                    Nguyễn Thanh Tùng
                                                </h4>
                                            </div>
                                        </div>
                                        <h2 className="text-lg font-semibold mb-4">
                                            Tạo bài viết
                                        </h2>
                                        {/* Nội dung cuộn khi dài */}
                                        <div className="max-h-[60vh] overflow-y-auto">
                                            {/* Form để đăng bài */}
                                            <form onSubmit={handlePostSubmit}>
                                                {/* Phần nhập nội dung bài viết */}
                                                <textarea
                                                    value={postContent}
                                                    onChange={handlePostChange}
                                                    placeholder="hôm nay đẹp trời"
                                                    className="w-full p-2 mb-4 bg-gray-100 rounded-md h-24 border-none outline-none resize-none"
                                                />
                                                {/* Thêm ảnh/video */}
                                                <div className="mb-4 border border-gray-300 rounded-lg p-2 text-center text-gray-500">
                                                    <input
                                                        type="file"
                                                        accept="image/*, video/*"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        className="w-full opacity-0 absolute cursor-pointer"
                                                    />
                                                    {files.length > 0 ? (
                                                        <div className="grid gap-2 w-full max-w-lg mt-3 mx-auto">
                                                            {files.length === 1 && (
                                                                <div className="relative w-full">
                                                                    {files[0] instanceof
                                                                        File && (
                                                                            <>
                                                                                <img
                                                                                    src={URL.createObjectURL(
                                                                                        files[0]
                                                                                    )}
                                                                                    alt="selected"
                                                                                    className="w-full rounded-lg"
                                                                                />
                                                                                <button
                                                                                    className="absolute top-2 right-2  text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                                                                    onClick={() =>
                                                                                        handleRemoveImage(
                                                                                            0
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    ❌
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                </div>
                                                            )}

                                                            {files.length === 2 && (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {files.map(
                                                                        (
                                                                            file,
                                                                            index
                                                                        ) =>
                                                                            file instanceof
                                                                            File && (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="relative"
                                                                                >
                                                                                    <img
                                                                                        src={URL.createObjectURL(
                                                                                            file
                                                                                        )}
                                                                                        alt="selected"
                                                                                        className="w-full rounded-lg"
                                                                                    />
                                                                                    <button
                                                                                        className="absolute top-2 right-2  text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                                                                        onClick={() =>
                                                                                            handleRemoveImage(
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        ❌
                                                                                    </button>
                                                                                </div>
                                                                            )
                                                                    )}
                                                                </div>
                                                            )}

                                                            {files.length === 3 && (
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <div className="relative col-span-2 ">
                                                                        {files[0] instanceof
                                                                            File && (
                                                                                <>
                                                                                    <img
                                                                                        src={URL.createObjectURL(
                                                                                            files[0]
                                                                                        )}
                                                                                        alt="selected"
                                                                                        className="w-full h-full object-cover rounded-lg"
                                                                                    />
                                                                                    <button
                                                                                        className="absolute top-2 right-2  text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                                                                        onClick={() =>
                                                                                            handleRemoveImage(
                                                                                                0
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        ❌
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                    </div>
                                                                    <div className="grid grid-rows-2 gap-2">
                                                                        {files
                                                                            .slice(
                                                                                1,
                                                                                3
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    file,
                                                                                    index
                                                                                ) =>
                                                                                    file instanceof
                                                                                    File && (
                                                                                        <div
                                                                                            key={
                                                                                                index +
                                                                                                1
                                                                                            }
                                                                                            className="relative"
                                                                                        >
                                                                                            <img
                                                                                                src={URL.createObjectURL(
                                                                                                    file
                                                                                                )}
                                                                                                alt="selected"
                                                                                                className="w-full h-full object-cover rounded-lg"
                                                                                            />
                                                                                            <button
                                                                                                className="absolute top-2 right-2  text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                                                                                onClick={() =>
                                                                                                    handleRemoveImage(
                                                                                                        index +
                                                                                                        1
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                ❌
                                                                                            </button>
                                                                                        </div>
                                                                                    )
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {files.length >= 4 && (
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {/* Ảnh lớn bên trái */}
                                                                    <div className="relative col-span-2">
                                                                        {files[0] instanceof File && (
                                                                            <>
                                                                                <img
                                                                                    src={URL.createObjectURL(files[0])}
                                                                                    alt="selected"
                                                                                    className="w-full h-full object-cover rounded-lg"
                                                                                />
                                                                                <button
                                                                                    className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                                                                    onClick={() => handleRemoveImage(0)}
                                                                                >
                                                                                    ❌
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Hai ảnh bên phải */}
                                                                    <div className="grid grid-rows-2 gap-2 relative">
                                                                        {files.slice(1, 3).map((file, index) => (
                                                                            file instanceof File && (
                                                                                <div key={index + 1} className="relative">
                                                                                    <img
                                                                                        src={URL.createObjectURL(file)}
                                                                                        alt="selected"
                                                                                        className={`w-full h-full object-cover rounded-lg ${index === 1 && files.length > 3 ? "opacity-50" : ""}`}
                                                                                    />
                                                                                    <button
                                                                                        className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                                                                                        onClick={() => handleRemoveImage(index + 1)}
                                                                                    >
                                                                                        ❌
                                                                                    </button>

                                                                                    {/* Nếu có nhiều hơn 3 ảnh, hiển thị số lượng ảnh bị ẩn */}
                                                                                    {index === 1 && files.length > 3 && (
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                                                                            <span className="text-white text-2xl font-bold">
                                                                                                +{files.length - 3}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                    ) : (
                                                        <span>
                                                            Thêm ảnh/video hoặc kéo
                                                            và thả
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Nút đăng bài */}
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        type="submit" // Đảm bảo nút là button submit
                                                        className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                                                    >
                                                        Đăng
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-start space-x-4 mt-4">
                        <button className="flex items-center text-red-500">
                            <FaVideo className="mr-2 text-lg" />
                            <span className="ml-2 text-sm">Phát trực tiếp</span>
                        </button>
                        <button className="flex items-center text-green-500">
                            <FaPhotoVideo className="mr-2 text-lg" />

                            <span className="ml-2 text-sm">Ảnh/Video</span>
                        </button>
                        <button className="flex items-center text-yellow-500">
                            <FaSmile className="mr-2 text-lg" />

                            <span className="ml-2 text-sm">
                                Cảm xúc/hoạt động
                            </span>
                        </button>
                    </div>
                </div>

                {/* Danh sách Stories */}
                <div className="flex mb-5 space-x-4 overflow-x-auto">
                    {/* Tạo tin */}
                    <a href="/story-up">
                        <div className="relative w-24 h-40 bg-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center">
                            <img
                                src="https://randomuser.me/api/portraits/men/4.jpg"
                                alt="Create Story"
                                className="w-12 h-12 rounded-full border-2 border-blue-500"
                            />
                            <span className="text-sm text-gray-300 mt-2">
                                Tạo tin
                            </span>
                            <button className="absolute bottom-2 bg-blue-500 text-white p-1 rounded-full text-lg">
                                +
                            </button>
                        </div>
                    </a>

                    {/* Stories của bạn bè */}
                    {friendsStories.map((friend, index) => (
                        <div
                            key={index}
                            className="relative w-24 h-40 bg-gray-700 rounded-lg shadow-md"
                        >
                            <a
                                href="/StoryDetail"
                                className="w-full h-full block"
                            >
                                <img
                                    src={friend.img}
                                    alt={friend.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </a>
                            <div className="absolute bottom-2 left-2">
                                <span className="text-sm text-gray-200 font-semibold">
                                    {friend.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {fakePosts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-6">
                        {/* Header */}
                        <div className="flex items-center mb-4">
                            <img src={post.user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                            <div className="ml-3 flex-1">
                                <h4 className="text-sm font-medium text-gray-800">{post.user.name}</h4>
                                <p className="text-xs text-blue-500">Just Now</p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-gray-700 mb-4">{post.content}</p>

                        {/* Images */}
                        {post.images.length === 1 && (
                            <img src={post.images[0]} alt="Post Image" className="w-full h-auto rounded-lg cursor-pointer" onClick={() => handleImageClick(post.images[0])} />
                        )}
                        {post.images.length === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                {post.images.map((img, index) => (
                                    <img key={index} src={img} alt={`Post Image ${index}`} className="w-full h-full object-cover rounded-lg cursor-pointer" onClick={() => handleImageClick(img)} />
                                ))}
                            </div>
                        )}
                        {post.images.length === 3 && (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <img src={post.images[0]} alt="Main Image" className="w-full h-full object-cover rounded-lg cursor-pointer" onClick={() => handleImageClick(post.images[0])} />
                                </div>
                                <div className="grid grid-rows-2 gap-4">
                                    {post.images.slice(1).map((img, index) => (
                                        <img key={index} src={img} alt={`Post Image ${index}`} className="w-full h-full object-cover rounded-lg cursor-pointer" onClick={() => handleImageClick(img)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Like, Comment, Share */}
                        <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
                            <div className="flex space-x-4">
                                <button onClick={() => openLikesModal(post.id)}
                                    className="text-blue-500 font-semibold">👍 {post.likes} Likes</button>

                                <button onClick={() => openCommentsModal(post.id)}>💬 {post.comments.length} Comments</button>
                            </div>
                            <button className="flex items-center space-x-1">🔗 {post.shares} Shares</button>
                        </div>

                        <hr className="my-4" />

                        {/* Display 1-2 comments */}
                        <div className="space-y-3">
                            {post.comments.slice(0, 2).map((comment, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <img src={comment.user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-800">{comment.user.name}</h5>
                                        <p className="text-xs text-gray-600">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                            {post.comments.length > 2 && (
                                <button className="text-blue-500 text-sm mt-2" onClick={() => setShowCommentsModal(true)}>
                                    Xem thêm bình luận...
                                </button>
                            )}
                        </div>

                        <hr className="my-4" />

                        {/* Add Comment */}
                        <div className="flex items-center space-x-3">
                            <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="User" className="w-8 h-8 rounded-full" />
                            <input type="text" placeholder="Enter Your Comment" className="flex-1 bg-gray-100 p-2 rounded-lg text-sm" />
                            <button className="text-gray-500 text-xl"><IoSend /></button>
                        </div>
                    </div>
                ))}


                {selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={closeImageViewer}>
                        <div className="relative w-4/5 h-4/5 flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                            <img src={selectedImage} alt="Full View" className="w-full h-full object-contain rounded-lg" />
                            {files.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentIndex((prev) => (prev - 1 + files.length) % files.length)}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                                        ◀
                                    </button>
                                    <button
                                        onClick={() => setCurrentIndex((prev) => (prev + 1) % files.length)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                                        ▶
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {showLikesModal && selectedPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        onClick={() => setShowLikesModal(false)}>
                        <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>

                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-lg font-semibold">{selectedPost?.likes} người đã thích</h2>
                                <button className="text-gray-500 hover:text-gray-800"
                                    onClick={() => setShowLikesModal(false)}>✕</button>
                            </div>

                            {/* Danh sách */}
                            <div className="p-4 max-h-80 overflow-y-auto space-y-4">
                                {selectedPost?.likedBy?.map((user, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <img src={user.avatar} alt="User Avatar"
                                                className="w-10 h-10 rounded-full border border-gray-300" />
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-800">{user.name}</h5>
                                                {user.mutualFriends && <p className="text-xs text-gray-600">{user.mutualFriends}</p>}
                                            </div>
                                        </div>
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600">
                                            Thêm bạn bè
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {showCommentsModal && selectedPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setShowCommentsModal(false)}>
                        <div className="bg-white rounded-lg w-[700px] max-h-[90vh] overflow-hidden shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>

                            {/* Header - Thông tin bài viết */}
                            <div className="flex items-center px-4 py-3 border-b">
                                <img src={selectedPost.user.avatar} alt="User" className="w-10 h-10 rounded-full mr-3" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold">{selectedPost.user.name}</h3>
                                    <p className="text-xs text-gray-500">Vừa xong</p>
                                </div>
                                <button onClick={() => setShowCommentsModal(false)} className="text-gray-500 hover:text-gray-700">
                                    ✖
                                </button>
                            </div>

                            {/* Nội dung và hình ảnh bài viết */}
                            <div className="flex-1 overflow-y-auto">
                                {selectedPost.images?.length > 0 && (
                                    <div className="relative w-full max-h-96 overflow-hidden">
                                        <img src={selectedPost.images[currentIndex]} alt="Post Image" className="w-full h-96 object-cover" />
                                        {selectedPost.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setCurrentIndex((prev) => (prev - 1 + selectedPost.images.length) % selectedPost.images.length)}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                                                    ◀
                                                </button>
                                                <button
                                                    onClick={() => setCurrentIndex((prev) => (prev + 1) % selectedPost.images.length)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                                                    ▶
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm text-gray-700">{selectedPost.content}</p>
                                </div>

                                {/* Danh sách bình luận */}
                                <div className="px-4 py-3 overflow-y-auto max-h-[300px]">
                                    {selectedPost.comments?.map((comment, index) => (
                                        <div key={index} className="flex items-start space-x-3 mb-4">
                                            <img src={comment.user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                                            <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                                                <h5 className="text-sm font-semibold">{comment.user.name}</h5>
                                                <p className="text-sm text-gray-700">{comment.text}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                                    <button className="hover:underline">Thích</button>
                                                    <button className="hover:underline">Phản hồi</button>
                                                    <span>2 giờ trước</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nhập bình luận */}
                            <div className="border-t px-4 py-3 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Viết bình luận..."
                                    className="flex-1 px-3 py-2 border rounded-full outline-none"
                                />
                                <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Gửi</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
