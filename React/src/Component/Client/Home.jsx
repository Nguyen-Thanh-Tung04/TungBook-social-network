// Import các thư viện cần thiết
import React, { useState } from "react";
import { FaVideo, FaPhotoVideo, FaSmile } from "react-icons/fa"; // Import các icon cần dùng
import axios from "axios";  

const Home = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image); // Đặt ảnh được click vào state
    };

    const closeImageViewer = () => {
        setSelectedImage(null); // Đóng chế độ xem ảnh
    };
    const [showLikesModal, setShowLikesModal] = useState(false);


    // Bình luận 
    const [showCommentsModal, setShowCommentsModal] = useState(false);

    // Đăng bài 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postContent, setPostContent] = useState("");  // Dùng để lưu nội dung bài viết
    const [file, setFile] = useState(null);  // Dùng để lưu file tải lên


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Lưu file được chọn
    };
    
    const handlePostSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("user_id", 3);
        formData.append("type_id", 1);
        formData.append("content", postContent);
        if (file) {
            formData.append("file", file);
        }
    
        // ✅ Kiểm tra xem file có trong formData không
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            console.log("Response từ server:", response.data);
            toggleModal();
        } catch (error) {
            console.error("Lỗi khi gửi request:", error.response ? error.response.data : error);
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
        className="flex-1 p-2 bg-gray-200 w-full text-gray-300 rounded-lg focus:outline-none"
        onClick={toggleModal}
    />

    {/* Modal */}
    {isModalOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={toggleModal}
        >
            <div
                className="bg-white rounded-lg p-6 w-3/6 h-3/6"
                onClick={(e) => e.stopPropagation()}
            >
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
                <h2 className="text-lg font-semibold mb-4">Tạo bài viết</h2>

                {/* Form để đăng bài */}
                <form onSubmit={handlePostSubmit}>
                    {/* Phần nhập nội dung bài viết */}
                    <textarea
                        value={postContent}
                        onChange={handlePostChange}
                        placeholder="hôm nay đẹp trời"
                        className="w-full p-2 mb-4 bg-gray-100 rounded-md h-24"
                    />

                    {/* Thêm ảnh/video */}
                    <div className="mb-4 border border-gray-300 rounded-lg p-2 text-center text-gray-500">
                        <input
                            type="file"
                            accept="image/*, video/*"
                            onChange={handleFileChange}
                            className="w-full opacity-0 absolute cursor-pointer"
                        />
                        {file ? (
                            <p>{file.name}</p>
                        ) : (
                            <span>Thêm ảnh/video hoặc kéo và thả</span>
                        )}
                    </div>

                    {/* Nút đăng bài */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"  // Đảm bảo nút là button submit
                            className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                        >
                            Đăng
                        </button>
                    </div>
                </form>
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
                <div className="flex space-x-4 overflow-x-auto">
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

                {/* Bài viết 1 ảnh  */}
                <div className="flex-1  py-7  mx-auto">
                    <div className="bg-white p-4 rounded shadow-md">
                        {/* Header */}
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
                                <p className="text-xs text-gray-500">
                                    Add New Post · 3 hour ago
                                </p>
                            </div>
                        </div>
                        {/* Content */}
                        <p className="text-sm text-gray-700 mb-4">
                            Lao động là vinh quang .
                        </p>

                        {/* Image */}
                        <div className="max-w-full rounded overflow-hidden">
                            <img
                                src="https://phunugioi.com/wp-content/uploads/2020/04/nhung-hinh-anh-dep-ve-que-huong-dat-nuoc-con-nguoi-viet-nam.jpg"
                                alt="Post"
                                className="w-full h-auto object-cover cursor-pointer"
                                onClick={() =>
                                    handleImageClick(
                                        "https://phunugioi.com/wp-content/uploads/2020/04/nhung-hinh-anh-dep-ve-que-huong-dat-nuoc-con-nguoi-viet-nam.jpg"
                                    )
                                }
                            />
                        </div>

                        {/* Modal hiển thị ảnh phóng to */}
                        {selectedImage && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                                onClick={closeImageViewer}
                            >
                                <div className="relative w-4/5 h-4/5">
                                    <img
                                        src={selectedImage}
                                        alt="Phóng to"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                    <button
                                        className="absolute top-4 right-4 bg-white p-2 rounded-full text-black"
                                        onClick={closeImageViewer}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Like, Comment, Share */}
                        <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
                            <div className="flex space-x-2">
                                {/* Button Like */}
                                <button
                                    className="flex items-center space-x-1"
                                    onClick={() => setShowLikesModal(true)} // Hiển thị modal
                                >
                                    <span>👍</span>
                                    <span>140 Likes</span>
                                </button>

                                {/* Modal danh sách người thích */}
                                {showLikesModal && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                                        onClick={() => setShowLikesModal(false)} // Đóng modal khi click vào nền
                                    >
                                        <div
                                            className="bg-white w-full max-w-sm rounded-lg shadow-lg overflow-hidden"
                                            onClick={(e) => e.stopPropagation()} // Ngăn không đóng modal khi click vào nội dung
                                        >
                                            {/* Header */}
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <h2 className="text-lg font-semibold">140 người đã thích</h2>
                                                <button
                                                    className="text-gray-500 hover:text-gray-800"
                                                    onClick={() => setShowLikesModal(false)} // Nút đóng modal
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            {/* Danh sách người đã thích */}
                                            <div className="p-4 space-y-4">
                                                {[
                                                    { name: "Trần Minh Điện", mutualFriends: "1 bạn chung" },
                                                    { name: "Bùi Thơm", mutualFriends: "1 bạn chung" },
                                                    { name: "Đào Huyền", mutualFriends: null },
                                                ].map((user, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"
                                                                    }/${index + 10}.jpg`}
                                                                alt="User Avatar"
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                            <div>
                                                                <h5 className="text-sm font-medium text-gray-800">
                                                                    {user.name}
                                                                </h5>
                                                                {user.mutualFriends && (
                                                                    <p className="text-xs text-gray-600">
                                                                        {user.mutualFriends}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                                                            Thêm bạn bè
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Button "20 Comments" */}
                                <button
                                    className="flex items-center space-x-1"
                                    onClick={() => setShowCommentsModal(true)}
                                >
                                    <span>💬</span>
                                    <span>20 Comments</span>
                                </button>

                                {/* Modal hiển thị chi tiết bài viết và bình luận */}
                                {showCommentsModal && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                                        onClick={() => setShowCommentsModal(false)} // Đóng modal khi click vào nền đen
                                    >
                                        <div
                                            className="bg-white w-full max-w-2xl max-h-screen rounded-lg shadow-lg overflow-y-auto"
                                            onClick={(e) => e.stopPropagation()} // Ngăn không đóng modal khi click vào nội dung
                                        >
                                            {/* Header */}
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <h2 className="text-lg font-semibold">Bài viết của Anna Sthesia</h2>
                                                <button
                                                    className="text-gray-500 hover:text-gray-800"
                                                    onClick={() => setShowCommentsModal(false)}
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            {/* Nội dung */}
                                            <div className="p-4">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <img
                                                        src="https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg"
                                                        alt="Main Image"
                                                        className="col-span-3 w-full h-auto rounded-lg"
                                                    />
                                                </div>

                                                {/* Bình luận */}
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-start space-x-3">
                                                        <img
                                                            src="https://randomuser.me/api/portraits/men/2.jpg"
                                                            alt="User"
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div>
                                                            <h5 className="text-sm font-medium text-gray-800">Phi Hùng</h5>
                                                            <p className="text-xs text-gray-600">Còn phòng không ạ?</p>
                                                            <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                                                <button>Like</button>
                                                                <button>Reply</button>
                                                                <span>1 phút</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-3">
                                                        <img
                                                            src="https://randomuser.me/api/portraits/men/3.jpg"
                                                            alt="User"
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div>
                                                            <h5 className="text-sm font-medium text-gray-800">Phi Hùng</h5>
                                                            <p className="text-xs text-gray-600">Còn phòng không ạ?</p>
                                                            <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                                                <button>Like</button>
                                                                <button>Reply</button>
                                                                <span>1 phút</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Add Comment */}
                                            <div className="flex items-center space-x-3 p-4 border-t">
                                                <img
                                                    src="https://randomuser.me/api/portraits/women/2.jpg"
                                                    alt="User"
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Bình luận dưới tên Nguyễn Thanh Tùng"
                                                    className="flex-1 bg-gray-100 p-2 rounded-lg text-sm"
                                                />
                                                <button className="text-gray-500">📎</button>
                                                <button className="text-gray-500">😊</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button className="flex items-center space-x-1">
                                <span>🔗</span>
                                <span>99 Shares</span>
                            </button>
                        </div>

                        <hr className="my-4" />

                        {/* Comments */}
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <img
                                    src="https://randomuser.me/api/portraits/men/13.jpg"
                                    alt="User"
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <h5 className="text-sm font-medium text-gray-800">
                                        Monty Carlo
                                    </h5>
                                    <p className="text-xs text-gray-600">
                                        Anh Tùng đẹp trai
                                    </p>
                                    <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                        <button>Like</button>
                                        <button>Reply</button>
                                        <button>Translate</button>
                                        <span>5 min</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <img
                                    src="https://randomuser.me/api/portraits/men/77.jpg"
                                    alt="User"
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <h5 className="text-sm font-medium text-gray-800">
                                        Paul Molive
                                    </h5>
                                    <p className="text-xs text-gray-600">
                                        Anh Tùng đẹp trai
                                    </p>
                                    <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                        <button>Like</button>
                                        <button>Reply</button>
                                        <button>Translate</button>
                                        <span>5 min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* Add Comment */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/13.jpg"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <input
                                type="text"
                                placeholder="Enter Your Comment"
                                className="flex-1 bg-gray-100 p-2 rounded text-sm"
                            />
                            <button>📎</button>
                            <button>😊</button>
                        </div>
                    </div>
                </div>
                {/* Bài viết 2 ảnh */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <img
                            src="https://randomuser.me/api/portraits/women/1.jpg"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-gray-800">
                                Anna Sthesia{" "}
                                <span className="text-xs text-gray-500">
                                    Add New Post
                                </span>
                            </h4>
                            <p className="text-xs text-blue-500">Just Now</p>
                        </div>
                        <button className="text-gray-500">...</button>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-700 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Morbi nulla dolor, ornare at commodo non, feugiat non
                        nisi. Phasellus faucibus mollis pharetra. Proin blandit
                        ac massa sed rhoncus
                    </p>

                    {/* Images */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Ảnh bên trái */}
                        <div>
                            <img
                                src="https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg"
                                alt="Left Image"
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() =>
                                    handleImageClick(
                                        "https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg"
                                    )
                                }
                            />
                        </div>

                        {/* Ảnh bên phải */}
                        <div>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU"
                                alt="Right Image"
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() =>
                                    handleImageClick(
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU"
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Modal hiển thị ảnh phóng to */}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
                            onClick={closeImageViewer}
                        >
                            <div className="relative w-4/5 h-4/5">
                                <img
                                    src={selectedImage}
                                    alt="Phóng to"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                <button
                                    className="absolute top-4 right-4 bg-white p-2 rounded-full text-black"
                                    onClick={closeImageViewer}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Like, Comment, Share */}
                    <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
                        <div className="flex space-x-4">
                            <button className="flex items-center space-x-1">
                                <span>👍</span>
                                <span>140 Likes</span>
                            </button>
                            <button className="flex items-center space-x-1">
                                <span>💬</span>
                                <span>20 Comment</span>
                            </button>
                        </div>
                        <button className="flex items-center space-x-1">
                            <span>🔗</span>
                            <span>99 Share</span>
                        </button>
                    </div>

                    <hr className="mb-4" />

                    {/* Comments */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/2.jpg"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <h5 className="text-sm font-medium text-gray-800">
                                    Monty Carlo
                                </h5>
                                <p className="text-xs text-gray-600">
                                    Lorem ipsum dolor sit amet
                                </p>
                                <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                    <button>Like</button>
                                    <button>Reply</button>
                                    <button>Translate</button>
                                    <span>5 min</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/3.jpg"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <h5 className="text-sm font-medium text-gray-800">
                                    Paul Molive
                                </h5>
                                <p className="text-xs text-gray-600">
                                    Lorem ipsum dolor sit amet
                                </p>
                                <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                    <button>Like</button>
                                    <button>Reply</button>
                                    <button>Translate</button>
                                    <span>5 min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* Add Comment */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="https://randomuser.me/api/portraits/women/2.jpg"
                            alt="User"
                            className="w-8 h-8 rounded-full"
                        />
                        <input
                            type="text"
                            placeholder="Enter Your Comment"
                            className="flex-1 bg-gray-100 p-2 rounded-lg text-sm"
                        />
                        <button className="text-gray-500">📎</button>
                        <button className="text-gray-500">😊</button>
                    </div>
                </div>

                {/* Bài viết 3 ảnh  */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <img
                            src="https://randomuser.me/api/portraits/women/1.jpg"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-gray-800">
                                Anna Sthesia{" "}
                                <span className="text-xs text-gray-500">
                                    Add New Post
                                </span>
                            </h4>
                            <p className="text-xs text-blue-500">Just Now</p>
                        </div>
                        <button className="text-gray-500">...</button>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-700 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Morbi nulla dolor, ornare at commodo non, feugiat non
                        nisi. Phasellus faucibus mollis pharetra. Proin blandit
                        ac massa sed rhoncus
                    </p>

                    {/* Images */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {/* Ảnh lớn bên trái */}
                        <div className="col-span-2">
                            <img
                                src="https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg"
                                alt="Large Image"
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() =>
                                    handleImageClick(
                                        "https://s3.cloud.cmctelecom.vn/tinhte1/2017/12/4205775_C.jpg"
                                    )
                                }
                            />
                        </div>

                        {/* 2 ảnh nhỏ bên phải */}
                        <div className="grid grid-rows-2 gap-4">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU"
                                alt="Small Image 1"
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() =>
                                    handleImageClick(
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOX0ch2n86x0AvHIwRgRABjbyKFDSZCnBpUbseGs2MQr0XDHgthzYVb-iqsfDU0eNil70&usqp=CAU"
                                    )
                                }
                            />
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTo0RlA5zJ3VvRDHgKsL1y2hyckhuebXhePOoLWF8fiN8hsBnbgwWaCUsMnbJNxLisZBQ&usqp=CAU"
                                alt="Small Image 2"
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() =>
                                    handleImageClick(
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTo0RlA5zJ3VvRDHgKsL1y2hyckhuebXhePOoLWF8fiN8hsBnbgwWaCUsMnbJNxLisZBQ&usqp=CAU"
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Modal hiển thị ảnh phóng to */}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                            onClick={closeImageViewer}
                        >
                            <div className="relative w-4/5 h-4/5">
                                <img
                                    src={selectedImage}
                                    alt="Phóng to"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                <button
                                    className="absolute top-4 right-4 bg-white p-2 rounded-full text-black"
                                    onClick={closeImageViewer}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Like, Comment, Share */}
                    <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
                        <div className="flex space-x-4">
                            <button className="flex items-center space-x-1">
                                <span>👍</span>
                                <span>140 Likes</span>
                            </button>
                            <button className="flex items-center space-x-1">
                                <span>💬</span>
                                <span>20 Comment</span>
                            </button>
                        </div>
                        <button className="flex items-center space-x-1">
                            <span>🔗</span>
                            <span>99 Share</span>
                        </button>
                    </div>

                    <hr className="mb-4" />

                    {/* Comments */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/2.jpg"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <h5 className="text-sm font-medium text-gray-800">
                                    Monty Carlo
                                </h5>
                                <p className="text-xs text-gray-600">
                                    Lorem ipsum dolor sit amet
                                </p>
                                <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                    <button>Like</button>
                                    <button>Reply</button>
                                    <button>Translate</button>
                                    <span>5 min</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/3.jpg"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <h5 className="text-sm font-medium text-gray-800">
                                    Paul Molive
                                </h5>
                                <p className="text-xs text-gray-600">
                                    Lorem ipsum dolor sit amet
                                </p>
                                <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                    <button>Like</button>
                                    <button>Reply</button>
                                    <button>Translate</button>
                                    <span>5 min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* Add Comment */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="https://randomuser.me/api/portraits/women/2.jpg"
                            alt="User"
                            className="w-8 h-8 rounded-full"
                        />
                        <input
                            type="text"
                            placeholder="Enter Your Comment"
                            className="flex-1 bg-gray-100 p-2 rounded-lg text-sm"
                        />
                        <button className="text-gray-500">📎</button>
                        <button className="text-gray-500">😊</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
