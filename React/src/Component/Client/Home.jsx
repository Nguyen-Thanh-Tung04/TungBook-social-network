// Import các thư viện cần thiết
import React, { useEffect, useRef, useState } from "react";
import { FaVideo, FaPhotoVideo, FaSmile } from "react-icons/fa"; // Import các icon cần dùng
import axios from "axios";
import { IoSend, IoEllipsisHorizontal } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        formData.append("type_id", 1);
        formData.append("content", postContent);

        // Thêm nhiều file vào FormData
        files.forEach((file) => {
            formData.append("files[]", file);
        });

        const token = localStorage.getItem("authToken");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/posts",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            console.log("Response từ server:", response.data);
            toggleModal();

            // Cập nhật lại danh sách bài viết
            await fetchPosts();
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
            name: "Đỗ  Tươi ",
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


    const [selectedPostId, setSelectedPostId] = useState(null);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null); // <-- chứa dữ liệu real

    const dummyPostsData = [
        {
            id: 1,
            likes: 3,
            likedBy: [
                {
                    name: "Nguyễn Hữu An",
                    avatar: "https://i.pravatar.cc/150?img=8",
                    mutualFriends: "2 bạn chung",
                },
                {
                    name: "Nam Tép",
                    avatar: "https://i.pravatar.cc/150?img=12",
                },
                {
                    name: "Nguyễn Kuồng",
                    avatar: "https://i.pravatar.cc/150?img=25",
                },
            ],
        },
    ];

    const openLikesModal = async (postId) => {
        setSelectedPostId(postId);
        setShowLikesModal(true);

        try {
            // ✅ Gọi đúng địa chỉ Laravel API
            const res = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}/likes`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // ← đảm bảo gửi token
                },
            });


            // console.log("✅ Dữ liệu từ API:", res.data);

            if (res.data && Array.isArray(res.data.likedBy)) {
                const baseStorageUrl = "http://127.0.0.1:8000/storage/";

                // ✅ Gắn avatar đúng path
                const likedBy = res.data.likedBy.map((user) => ({
                    ...user,
                    avatar: user.avatar?.startsWith("http")
                        ? user.avatar
                        : baseStorageUrl + user.avatar,
                }));

                // ✅ Lưu dữ liệu post được chọn
                setSelectedPost({
                    post_id: res.data.post_id,
                    likes: res.data.likes,
                    likedBy,
                });
            } else {
                console.warn("❗API không trả về likedBy hợp lệ:", res.data);
                setSelectedPost({ post_id: postId, likes: 0, likedBy: [] });
            }
        } catch (error) {
            console.error("❌ Lỗi khi gọi API getLikes:", error.message || error);
            alert("Lỗi mạng: Không kết nối được đến server!");
            setSelectedPost({ post_id: postId, likes: 0, likedBy: [] });
        }
    };



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

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/posts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fetchedPosts = response.data;

            setPosts(fetchedPosts); // ✅ cập nhật danh sách post
            
            const reactionMap = {};
            fetchedPosts.forEach(post => {
                if (post.user_reaction) {
                    reactionMap[post.id] = post.user_reaction;
                }
            });
            setPostReactions(reactionMap); // ✅ đồng bộ cảm xúc hiện tại vào state


            // ✅ cập nhật reaction_summary theo từng bài
            setPostSummaries(
                fetchedPosts.reduce((acc, post) => {
                    acc[post.id] = post.reaction_summary || {};
                    return acc;
                }, {})
            );
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };


    // dấu 3 chấm bài viết 
    const [openPostOptionsId, setOpenPostOptionsId] = useState(null);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);


    const togglePostOptionsModal = (postId) => {
        setOpenPostOptionsId(prevId => (prevId === postId ? null : postId));
    };


    // Đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpenPostOptionsId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleEditPost = () => {
        console.log("Chỉnh sửa bài viết");
        setIsPostOptionsModalOpen(false);
    };

    const handleEditPrivacy = () => {
        console.log("Chỉnh sửa đối tượng");
        setIsPostOptionsModalOpen(false);
    };

    // Hàm xóa bài viết
    const handleDeletePost = async (postId) => {
        console.log("Xóa bài viết:", postId);
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                const token = localStorage.getItem("authToken");
                await axios.delete(`http://localhost:8000/api/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Cập nhật lại UI sau khi xóa
                setPosts(posts.filter(post => post.id !== postId));
                toast.success("Bài viết đã được xóa!");
            } catch (error) {
                toast.error("Xóa bài viết thất bại!");
                console.error("Xóa bài viết lỗi:", error);
            }
        }
    };
    // Hiển thị ảnh đại diện người dùng
    const [userData, setUserData] = useState({
        name: '',
        avatar_url: '',
        posts: 0,
        followers: 0,
        following: 0,
    });
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://127.0.0.1:8000/api/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // console.log(response.data); // Kiểm tra dữ liệu trả về
                setUserData(response.data.user);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };
        fetchUserData();
    }, []);

    // Hiển thị menu cảm xúc
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPostId, setActiveReactionPostId] = useState(null);
    const [postSummaries, setPostSummaries] = useState({});


    const reactionTypes = {
        like: '👍',
        love: '❤️',
        care: '🥰',
        haha: '😆',
        wow: '😮',
        sad: '😢',
        angry: '😡',
    };

    const mapIconToType = (icon) => {
        const entry = Object.entries(reactionTypes).find(([, emoji]) => emoji === icon);
        return entry ? entry[0] : 'like';
    };
    const handleReactionClick = async (icon, postId) => {
        const reactionType = mapIconToType(icon);
        const currentReaction = postReactions[postId];

        setHoveredPostId(null);

        // Nếu người dùng bấm lại cảm xúc đã chọn → gỡ bỏ reaction
        if (currentReaction === reactionType) {
            setPostReactions((prev) => ({ ...prev, [postId]: null }));
            setActiveReactionPostId(postId);
            setTimeout(() => setActiveReactionPostId(null), 600);

            try {
                await axios.delete(`http://127.0.0.1:8000/api/reactions/post/${postId}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                console.log('Đã gỡ reaction');
            } catch (error) {
                console.error('Lỗi khi gỡ reaction:', error.response?.data || error.message);
            }

            return;
        }

        // Ngược lại: tạo hoặc cập nhật cảm xúc
        setPostReactions((prev) => ({ ...prev, [postId]: reactionType }));

        setPostSummaries((prev) => {
            const prevSummary = prev[postId] || {};
            const currentReaction = postReactions[postId];

            const updated = { ...prevSummary };

            // Nếu có cảm xúc cũ → giảm
            if (currentReaction && updated[currentReaction] > 0) {
                updated[currentReaction] -= 1;
            }

            // Nếu là cảm xúc mới → tăng
            updated[reactionType] = (updated[reactionType] || 0) + 1;

            return { ...prev, [postId]: updated };
        });
        setActiveReactionPostId(postId);
        setTimeout(() => setActiveReactionPostId(null), 600);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/reactions', {
                post_id: postId,
                reaction_type: reactionType,
            }, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            console.log('Gửi cảm xúc thành công:', res.data);
        } catch (error) {
            console.error('Lỗi khi gửi reaction:', error.response?.data || error.message);
        }
    };




    return (
        <div className="" style={{ width: "50vw" }}>
            <main className="container mx-auto px-9 py-8 max-w-[1005px] bg-gray-200 ">

                {/* Thanh trạng thái */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex items-center">
                        <img
                            src={userData?.avatar_url || 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/430028095_1758861091286933_7708332768369038985_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHe4DTpbgymh3ve45vOO9iOJrbBaxDj87QmtsFrEOPztDUYQ7OYmp0HgJgDKax5xCYXQ4XAE0toaxhN-Keq3fcP&_nc_ohc=StIE3wkzbkIQ7kNvgHZX9fC&_nc_oc=Adk4jWxUg0SCKCbUa-5T2EiIf4_S4rxqfgZwwLKsz0qt9ZlkAIIwESzh0CnwdpuIQK4&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=5rVn09AEmF7Qt1jJA3a1lA&oh=00_AYHA91Oda2kvtNjXtwejlCK1m5kJiANeG3t5fY5_SpamxA&oe=67F069EF'}
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
                                                src={userData?.avatar_url}
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
                                src={userData?.avatar_url || 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/430028095_1758861091286933_7708332768369038985_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHe4DTpbgymh3ve45vOO9iOJrbBaxDj87QmtsFrEOPztDUYQ7OYmp0HgJgDKax5xCYXQ4XAE0toaxhN-Keq3fcP&_nc_ohc=StIE3wkzbkIQ7kNvgHZX9fC&_nc_oc=Adk4jWxUg0SCKCbUa-5T2EiIf4_S4rxqfgZwwLKsz0qt9ZlkAIIwESzh0CnwdpuIQK4&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=5rVn09AEmF7Qt1jJA3a1lA&oh=00_AYHA91Oda2kvtNjXtwejlCK1m5kJiANeG3t5fY5_SpamxA&oe=67F069EF'}
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

                {/* Danh sách bài viết */}


                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <img src={post.user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                                <div className="ml-3 flex-1">
                                    <h4 className="text-sm font-medium text-gray-800">{post.user.name}</h4>
                                    <p className="text-xs text-blue-500">Just Now</p>
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
                                        className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg post-menu"
                                    >
                                        <button
                                            className="w-full text-left py-2 px-4 hover:bg-gray-100"
                                            onClick={handleEditPost}
                                        >
                                            ✏️ Chỉnh sửa bài viết
                                        </button>
                                        <button
                                            className="w-full text-left py-2 px-4 hover:bg-gray-100"
                                            onClick={handleEditPrivacy}
                                        >
                                            🔒 Chỉnh sửa đối tượng
                                        </button>
                                        <button
                                            className="w-full text-left py-2 px-4 hover:bg-gray-100 text-red-500"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            🗑️ Xóa bài viết
                                        </button>
                                    </div>
                                )}
                            </div>


                        </div>

                        <p className="text-sm text-gray-700 mb-4">{post.content}</p>

                        {post.images && post.images.length === 1 && (
                            <img
                                src={post.images[0]}
                                alt="Post Image"
                                className="w-full h-auto rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(post.images[0])}
                            />
                        )}

                        {post.images && post.images.length === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                {post.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Post Image ${index}`}
                                        className="w-full h-full object-cover rounded-lg cursor-pointer"
                                        onClick={() => handleImageClick(img)}
                                    />
                                ))}
                            </div>
                        )}

                        {post.images && post.images.length === 3 && (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <img
                                        src={post.images[0]}
                                        alt="Main Image"
                                        className="w-full h-full object-cover rounded-lg cursor-pointer"
                                        onClick={() => handleImageClick(post.images[0])}
                                    />
                                </div>
                                <div className="grid grid-rows-2 gap-4">
                                    {post.images.slice(1).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Post Image ${index}`}
                                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                                            onClick={() => handleImageClick(img)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cảm xúc tổng hợp */}
                        <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
                            <div
                                className="flex items-center space-x-1 cursor-pointer"
                                onClick={() => openLikesModal(post.id)}
                            >
                                {Object.entries(postSummaries[post.id] || {}).map(([type, count]) =>
                                    count > 0 && <span key={type} className="text-xl">{reactionTypes[type]}</span>
                                )}
                                <span className="text-sm font-medium">
                                    {Object.values(postSummaries[post.id] || {}).reduce((a, b) => a + b, 0)}
                                </span>

                            </div>


                            <div className="flex space-x-2 text-gray-500 text-sm">
                                <span className="flex items-center space-x-1">💬 <span>{post.comments?.length || 0}</span></span>
                                <span className="flex items-center space-x-1">🔁 <span>{post.shares}</span></span>
                            </div>
                        </div>

                        {/* Nút Thích - Bình luận - Chia sẻ */}
                        <div className="flex justify-around items-center text-gray-600 text-sm mt-2 border-t pt-2">
                            <div
                                className="relative flex-1 flex justify-center"
                                onPointerEnter={() => setHoveredPostId(post.id)}
                                onPointerLeave={() => setHoveredPostId(null)}
                            >
                                <button
                                    onClick={() => {
                                        const currentReaction = postReactions[post.id];
                                        if (currentReaction) {
                                            handleReactionClick(reactionTypes[currentReaction], post.id); // gỡ
                                        } else {
                                            handleReactionClick('👍', post.id); // chưa có → like
                                        }
                                    }}
                                    className={`flex items-center space-x-1 font-semibold transition 
    ${postReactions[post.id] ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                                >
                                    <span
                                        className={`text-xl transition-transform duration-500 ease-out 
    ${activeReactionPostId === post.id ? 'scale-150' : 'scale-100'}`}
                                    >
                                        {reactionTypes[postReactions[post.id]] || '👍'}
                                    </span>

                                    <span>
                                        {postReactions[post.id]
                                            ? {
                                                like: 'Thích',
                                                love: 'Yêu thích',
                                                care: 'Quan tâm',
                                                haha: 'Haha',
                                                wow: 'Wow',
                                                sad: 'Buồn',
                                                angry: 'Phẫn nộ',
                                            }[postReactions[post.id]]
                                            : 'Thích'}
                                    </span>
                                </button>


                                {/* Hover menu cảm xúc */}
                                <div className={`absolute -top-16 left-1/2 -translate-x-1/2 flex justify-start text-2xl items-center shadow-xl z-10 bg-white dark:bg-[#191818] gap-2 p-2 rounded-full transition-all duration-300 ${hoveredPostId === post.id ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    }`}>
                                    {Object.values(reactionTypes).map((icon, index) => (
                                        <button
                                            key={index}
                                            className="hover:scale-125 transition-transform rounded-full w-10 h-10 flex items-center justify-center shadow text-xl"
                                            onClick={() => handleReactionClick(icon, post.id)}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bình luận */}
                            <button onClick={() => openCommentsModal(post.id)} className="flex-1 flex justify-center items-center space-x-1 font-semibold">
                                <span>💬</span><span>Bình luận</span>
                            </button>

                            {/* Chia sẻ */}
                            <button className="flex-1 flex justify-center items-center space-x-1 font-semibold">
                                <span>🔁</span><span>Chia sẻ</span>
                            </button>
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
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        onClick={() => setShowLikesModal(false)}
                    >
                        <div
                            className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-lg font-semibold">
                                    {selectedPost.likes} người đã thích
                                </h2>
                                <button
                                    className="text-gray-500 hover:text-gray-800 text-xl"
                                    onClick={() => setShowLikesModal(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Danh sách người like */}
                            <div className="p-4 max-h-80 overflow-y-auto space-y-4">
                                {selectedPost.likedBy.map((user, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center hover:bg-gray-100 p-2 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                                            />
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-800">{user.name}</h5>
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
