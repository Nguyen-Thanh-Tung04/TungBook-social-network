// src/Component/Client/js/ListPostUser.jsx
import React, { useRef, useEffect, useState } from "react";
import { IoEllipsisHorizontal, IoSend } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";

const ListPostUser = ({
    userData,
    autoFetch = false, // tùy chọn fetch bài viết tự động
    posts: externalPosts = [],
    setPosts: setExternalPosts = () => { },
    openCommentsModal = () => { },
    openLikesModal = () => { },
}) => {
    const [posts, setPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openPostOptionsId, setOpenPostOptionsId] = useState(null);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);

    // Optional: dùng state bên trong hoặc từ ngoài
    const postsToRender = autoFetch ? posts : externalPosts;
    const setPostsFinal = autoFetch ? setPosts : setExternalPosts;

    useEffect(() => {
        if (autoFetch) fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
          const token = localStorage.getItem("authToken");
      
          // 1. Lấy danh sách tất cả bài viết
          const postRes = await axios.get("http://127.0.0.1:8000/api/posts", {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          // 2. Lấy thông tin người dùng hiện tại
          const meRes = await axios.get("http://127.0.0.1:8000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          const myId = meRes.data.user.id;
      
          // 3. Lọc bài viết có user.id === myId
          const myPosts = postRes.data.filter((post) => post.user.id === myId);
      
          setPosts(myPosts);
          console.log("Bài viết của tôi:", myPosts);
        } catch (error) {
          console.error("Lỗi khi fetch bài viết:", error);
        }
      };
            
      
    const handleImageViewer = (image) => setSelectedImage(image);
    const closeImageViewer = () => setSelectedImage(null);

    const togglePostOptionsModal = (postId) => {
        setOpenPostOptionsId((prevId) => (prevId === postId ? null : postId));
    };

    const handleDeletePost = async (postId) => {
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                const token = localStorage.getItem("authToken");
                await axios.delete(`http://localhost:8000/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPostsFinal((prev) => prev.filter((p) => p.id !== postId));
                toast.success("Đã xoá bài viết!");
            } catch (error) {
                toast.error("Xoá thất bại!");
                console.error(error);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpenPostOptionsId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {postsToRender.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img
                                src={post.user.avatar}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-3">
                                <h4 className="text-sm font-medium">{post.user.name}</h4>
                                <p className="text-xs text-blue-500">Just now</p>
                            </div>
                        </div>
                        <div className="relative inline-block">
                            <button
                                ref={buttonRef}
                                onClick={() => togglePostOptionsModal(post.id)}
                                className="text-gray-500"
                            >
                                <IoEllipsisHorizontal size={20} />
                            </button>
                            {openPostOptionsId === post.id && (
                                <div
                                    ref={modalRef}
                                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
                                >
                                    <button className="px-4 py-2 w-full text-left hover:bg-gray-100">
                                        ✏️ Chỉnh sửa
                                    </button>
                                    <button className="px-4 py-2 w-full text-left hover:bg-gray-100">
                                        🔒 Đổi đối tượng
                                    </button>
                                    <button
                                        className="px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        🗑️ Xoá bài viết
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm mb-4 text-gray-700">{post.content}</p>

                    {/* Hiển thị ảnh */}
                    {post.images?.length === 1 && (
                        <img
                            src={post.images[0]}
                            className="w-full h-auto rounded-lg cursor-pointer"
                            onClick={() => handleImageViewer(post.images[0])}
                        />
                    )}

                    {post.images?.length === 2 && (
                        <div className="grid grid-cols-2 gap-4">
                            {post.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className="w-full h-full rounded-lg object-cover cursor-pointer"
                                    onClick={() => handleImageViewer(img)}
                                />
                            ))}
                        </div>
                    )}

                    {post.images?.length === 3 && (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <img
                                    src={post.images[0]}
                                    className="w-full h-full rounded-lg object-cover cursor-pointer"
                                    onClick={() => handleImageViewer(post.images[0])}
                                />
                            </div>
                            <div className="grid grid-rows-2 gap-4">
                                {post.images.slice(1).map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        className="w-full h-full rounded-lg object-cover cursor-pointer"
                                        onClick={() => handleImageViewer(img)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Like - Comment */}
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                        <div className="flex gap-4">
                            <button
                                className="text-blue-500"
                                onClick={() => openLikesModal(post.id)}
                            >
                                👍 {post.likes} Likes
                            </button>
                            <button onClick={() => openCommentsModal(post.id)}>
                                💬 {post.comments?.length || 0} Comments
                            </button>
                        </div>
                        <button>🔗 {post.shares} Shares</button>
                    </div>

                    <hr className="my-4" />

                    {/* Hiển thị bình luận ngắn */}
                    <div className="space-y-2">
                        {post.comments?.slice(0, 2).map((comment, i) => (
                            <div key={i} className="flex items-start space-x-3">
                                <img
                                    src={comment.user.avatar}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <h5 className="text-sm font-medium">{comment.user.name}</h5>
                                    <p className="text-xs text-gray-600">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {post.comments?.length > 2 && (
                            <button
                                className="text-blue-500 text-sm mt-1"
                                onClick={() => openCommentsModal(post.id)}
                            >
                                Xem thêm bình luận...
                            </button>
                        )}
                    </div>

                    <hr className="my-4" />

                    {/* Nhập bình luận mới */}
                    <div className="flex items-center gap-3">
                        <img
                            src={userData?.avatar_url || "https://via.placeholder.com/40"}
                            className="w-8 h-8 rounded-full"
                        />
                        <input
                            type="text"
                            placeholder="Viết bình luận..."
                            className="flex-1 p-2 bg-gray-100 rounded-lg text-sm"
                        />
                        <button className="text-gray-500 text-xl">
                            <IoSend />
                        </button>
                    </div>
                </div>
            ))}

            {/* Modal ảnh xem lớn */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={closeImageViewer}
                >
                    <div
                        className="relative w-4/5 h-4/5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ListPostUser;
