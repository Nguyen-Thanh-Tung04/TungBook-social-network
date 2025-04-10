// Import các thư viện cần thiết
import React, { useEffect, useRef, useState } from "react";
import { FaVideo, FaPhotoVideo, FaSmile } from "react-icons/fa"; // Import các icon cần dùng
import axios from "axios";
import { IoSend, IoEllipsisHorizontal } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from 'emoji-picker-react';


const Home = () => {

    // 👇 Thêm state để điều khiển emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // 👇 Hàm khi chọn emoji
    const handleEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji;

        // Nếu đang nhập bình luận thì cập nhật commentInput
        if (typeof setCommentInput === 'function') {
            setCommentInput(prev => prev + emoji);
        }

        // Nếu đang nhập nội dung bài viết thì cập nhật postContent
        if (typeof setPostContent === 'function') {
            // 👈 Ưu tiên dùng callback
            setPostContent(prev => prev + emoji);
        } else if (typeof handlePostChange === 'function' && typeof postContent === 'string') {
            // 👈 Fallback nếu không có setPostContent
            handlePostChange({ target: { value: postContent + emoji } });
        }
    };


    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image); // Đặt ảnh được click vào state
    };

    const closeImageViewer = () => {
        setSelectedImage(null); // Đóng chế độ xem ảnh
    };

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
            const res = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}/likes`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (res.data && Array.isArray(res.data.reactedBy)) {
                const baseStorageUrl = "http://127.0.0.1:8000/storage/";

                const likedBy = res.data.reactedBy.map((user) => ({
                    ...user,
                    avatar: user.avatar?.startsWith("http")
                        ? user.avatar
                        : baseStorageUrl + user.avatar,
                }));

                setSelectedPost({
                    post_id: res.data.post_id,
                    total_reactions: res.data.total_reactions,
                    likedBy, // vẫn đặt tên likedBy để không cần đổi code hiện tại
                });
            } else {
                setSelectedPost({ post_id: postId, total_reactions: 0, likedBy: [] });
            }
        } catch (error) {
            console.error("❌ Lỗi khi gọi API getLikes:", error.message || error);
            alert("Lỗi mạng: Không kết nối được đến server!");
            setSelectedPost({ post_id: postId, total_reactions: 0, likedBy: [] });
        }
    };

    // Bình luận
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const renderReplies = (replies) => {
        return replies.map((reply) => (
            <div key={reply.id} className="mt-2 ml-8 border-l-2 border-gray-300 pl-4">
                <div className="flex items-start space-x-2">
                    <img src={reply.user.avatar} className="w-7 h-7 rounded-full" />
                    <div className="bg-gray-200 p-2 rounded-lg w-full">
                        <h6 className="text-sm font-semibold">{reply.user.name}</h6>
                        <p className="text-sm text-gray-800">{reply.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <button className="hover:underline">Thích</button>
                            <button
                                onClick={() => {
                                    setReplyToCommentId(reply.id);
                                    setReplyContent('');
                                }}
                                className="hover:underline"
                            >
                                Phản hồi
                            </button>
                            <span>1 giờ trước</span>
                        </div>
                    </div>
                </div>

                {/* Form phản hồi cho reply */}
                {replyToCommentId === reply.id && (
                    <div className="mt-2 ml-12 space-y-2 w-full">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Viết phản hồi..."
                            className="w-full p-2 border rounded resize-none text-sm"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleReplySubmit(reply.id)}
                                className="text-white bg-green-500 px-3 py-1 rounded text-sm"
                            >
                                Gửi
                            </button>
                            <button
                                onClick={() => {
                                    setReplyToCommentId(null);
                                    setReplyContent('');
                                }}
                                className="text-gray-500 text-sm"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}

                {/* Đệ quy */}
                {reply.replies?.length > 0 && renderReplies(reply.replies)}
            </div>
        ));
    };

    const openCommentsModal = async (postId) => {
        setSelectedPostId(postId);
        setShowCommentsModal(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            const post = res.data;
            const baseStorageUrl = "http://127.0.0.1:8000/storage/";

            const formattedPost = {
                ...post,
                images: post.images?.map(img =>
                    img.startsWith("http") ? img : baseStorageUrl + img
                ),
                user: {
                    ...post.user,
                    avatar: post.user.avatar?.startsWith("http")
                        ? post.user.avatar
                        : baseStorageUrl + post.user.avatar,
                },
                comments: post.comments?.map((comment) => ({
                    ...comment,
                    user: {
                        ...comment.user,
                        avatar: comment.user.avatar?.startsWith("http")
                            ? comment.user.avatar
                            : baseStorageUrl + comment.user.avatar,
                    },
                })),
            };

            setSelectedPost(formattedPost);
            setCurrentIndex(0);
        } catch (error) {
            console.error("❌ Lỗi khi load bài viết:", error.response?.data || error.message);
            setShowCommentsModal(false);
            alert("Không thể tải chi tiết bài viết");
        }
    };

    // xóa comment 
    const [hoveredCommentId, setHoveredCommentId] = useState(null);
    const [openCommentOptionsId, setOpenCommentOptionsId] = useState(null);

    const toggleCommentOptionsModal = (commentId) => {
        setOpenCommentOptionsId(prev => (prev === commentId ? null : commentId));
    };

    const handleDeleteComment = async (commentId) => {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            try {
                await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                // Cập nhật lại UI: Xoá khỏi selectedPost.comments
                setSelectedPost((prev) => ({
                    ...prev,
                    comments: prev.comments.filter((comment) => comment.id !== commentId),
                }));

                toast.success("Đã xóa bình luận!");
            } catch (error) {
                toast.error("Xóa bình luận thất bại!");
                console.error("Lỗi xóa bình luận:", error);
            }
        }
    };


    // comment 
    const [commentInput, setCommentInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleCommentSubmit = async () => {
        if (!commentInput.trim()) return;

        setIsSending(true);
        try {
            const res = await axios.post(
                "http://localhost:8000/api/comments",
                {
                    post_id: selectedPostId,
                    content: commentInput,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            const newComment = res.data.comment;

            const baseStorageUrl = "http://localhost:8000/storage/";
            const formattedComment = {
                ...newComment,
                user: {
                    ...newComment.user,
                    avatar: newComment.user.avatar?.startsWith("http")
                        ? newComment.user.avatar
                        : baseStorageUrl + newComment.user.avatar,
                },
            };

            setSelectedPost((prev) => ({
                ...prev,
                comments: [...prev.comments, formattedComment],
            }));
            // ✅ Nếu bạn có lưu danh sách bài viết (posts)
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === selectedPostId
                        ? {
                            ...post,
                            comments_count: (post.comments_count || 0) + 1,
                        }
                        : post
                )
            );

            setCommentInput("");
        } catch (err) {
            console.error("❌ Gửi bình luận thất bại:", err);
        } finally {
            setIsSending(false);
        }
    };

    // Edit comment 
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    const handleUpdateComment = async (commentId) => {
        try {
            const res = await axios.put(
                `http://localhost:8000/api/comments/${commentId}`,
                { content: editingContent },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            const updatedComment = res.data.comment;
            const baseStorageUrl = "http://localhost:8000/storage/";

            const formattedComment = {
                ...updatedComment,
                user: {
                    ...updatedComment.user,
                    avatar: updatedComment.user.avatar?.startsWith("http")
                        ? updatedComment.user.avatar
                        : baseStorageUrl + updatedComment.user.avatar,
                },
            };

            setSelectedPost((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment.id === commentId ? formattedComment : comment
                ),
            }));

            setEditingCommentId(null);
            setEditingContent("");
            toast.success("Đã cập nhật bình luận!");
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật bình luận:", err);
            toast.error("Cập nhật thất bại!");
        }
    };

    const flattenReplies = (replies) => {
        const result = [];
        const traverse = (list) => {
            for (const reply of list) {
                result.push(reply);
                if (reply.replies && reply.replies.length > 0) {
                    traverse(reply.replies); // đệ quy
                }
            }
        };
        traverse(replies);
        return result;
    };
    const [openReplies, setOpenReplies] = useState([]);
    const toggleReplies = (commentId) => {
        setOpenReplies(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        );
    };


    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const insertReplyToTree = (comments, parentId, reply) => {
        return comments.map(comment => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), reply]
                };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: insertReplyToTree(comment.replies, parentId, reply)
                };
            }

            return comment;
        });
    };

    const handleReplySubmit = async (parentCommentId) => {
        if (!replyContent.trim()) return;

        try {
            const res = await axios.post("http://localhost:8000/api/comments", {
                post_id: selectedPostId,
                content: replyContent,
                parent_id: parentCommentId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
            });

            const newReply = res.data.comment;

            const baseStorageUrl = "http://localhost:8000/storage/";
            newReply.user.avatar = newReply.user.avatar?.startsWith("http")
                ? newReply.user.avatar
                : baseStorageUrl + newReply.user.avatar;

            // ✅ Cập nhật đúng cấu trúc comment (đa cấp)
            setSelectedPost(prev => ({
                ...prev,
                comments_count: (prev.comments_count || 0) + 1, // ✅ tăng số lượng comment
                comments: insertReplyToTree(prev.comments, parentCommentId, newReply)
            }));

            // ✅ Nếu bạn có lưu danh sách bài viết (posts)
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === selectedPostId
                        ? {
                            ...post,
                            comments_count: (post.comments_count || 0) + 1,
                        }
                        : post
                )
            );

            setReplyToCommentId(null);
            setReplyContent('');
        } catch (err) {
            console.error("❌ Gửi phản hồi thất bại:", err);
        }
    };

    const currentUserId = parseInt(localStorage.getItem('userId'), 10);

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

    // Chỉnh sửa bài viết 
    const [editingPost, setEditingPost] = useState(null); // null hoặc object bài viết
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditPost = (post) => {
        setEditingPost(post); // truyền dữ liệu post hiện tại
        setIsEditModalOpen(true); // mở modal
        setIsPostOptionsModalOpen(false); // đóng menu ba chấm
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

            // ✅ Cập nhật lại postSummaries để loại bỏ icon bị gỡ
            setPostSummaries((prev) => {
                const summary = { ...(prev[postId] || {}) };

                if (summary[currentReaction]) {
                    summary[currentReaction] -= 1;
                    if (summary[currentReaction] <= 0) {
                        delete summary[currentReaction]; // Xóa nếu count = 0
                    }
                }

                return { ...prev, [postId]: summary };
            });

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
                                                <div className="relative">
                                                    <textarea
                                                        value={postContent}
                                                        onChange={handlePostChange}
                                                        placeholder="Hôm nay đẹp trời"
                                                        className="w-full p-2 mb-2 bg-gray-100 rounded-md h-24 border-none outline-none resize-none"
                                                    />

                                                    {/* Nút mở emoji */}
                                                    <button
                                                        type="button"
                                                        className="absolute bottom-3 right-3 text-xl text-gray-500 hover:text-gray-700"
                                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                    >
                                                        <FaSmile />
                                                    </button>

                                                    {/* Emoji Picker nổi toàn màn hình, đúng vị trí của icon 😄 */}
                                                    {showEmojiPicker && (
                                                        <div
                                                            className="fixed z-[9999]"
                                                            style={{
                                                                bottom: "calc(50vh - 120px)", // tuỳ chỉnh để hiển thị phía trên nút emoji
                                                                right: "calc(50% - 630px)",    // căn giữa modal 700px + dịch nhẹ sang phải
                                                            }}
                                                        >
                                                            <div className="relative">
                                                                {/* Mũi tên chỉ xuống giống Facebook */}
                                                                <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-300 shadow z-10" />
                                                                <EmojiPicker
                                                                    onEmojiClick={handleEmojiClick}
                                                                    theme="light"
                                                                    height={350}
                                                                    width={300}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

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
                                            onClick={() => handleEditPost(post)} // truyền bài post cần sửa
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
                        <div className="flex items-center text-gray-600 text-sm mt-4">
                            {/* Cảm xúc tổng hợp - nằm bên trái (nếu có) */}
                            {postSummaries[post.id] && Object.keys(postSummaries[post.id]).length > 0 && (
                                <div
                                    className="flex items-center space-x-1 cursor-pointer"
                                    onClick={() => openLikesModal(post.id)}
                                >
                                    {Object.entries(postSummaries[post.id]).map(
                                        ([type, count]) =>
                                            count > 0 && (
                                                <span key={type} className="text-xl">
                                                    {reactionTypes[type]}
                                                </span>
                                            )
                                    )}
                                    <span className="text-sm font-medium">
                                        {Object.values(postSummaries[post.id]).reduce((a, b) => a + b, 0)}
                                    </span>
                                </div>
                            )}

                            {/* Bình luận và chia sẻ - luôn đẩy sang phải */}
                            <div className="flex space-x-4 text-gray-500 text-sm ml-auto">
                                <span className="flex items-center space-x-1">
                                    💬 <span>{post.comments_count || 0}</span>
                                </span>

                                <span className="flex items-center space-x-1">
                                    🔁 <span>{post.shares}</span>
                                </span>
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
                                            <span className="text-xl">{reactionTypes[user.reaction]}</span> {/* hiện cảm xúc */}

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
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                        onClick={() => setShowCommentsModal(false)}
                    >
                        <div
                            className="bg-white rounded-lg w-[700px] max-h-[90vh] overflow-hidden shadow-lg flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header: Thông tin bài viết hoặc user nếu cần */}
                            <div className="px-4 py-2 border-b flex items-center justify-between">
                                <h2 className="text-base font-semibold">Bình luận</h2>
                                <button
                                    onClick={() => setShowCommentsModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✖
                                </button>
                            </div>

                            {/* Danh sách bình luận (nên scroll được) */}
                            <div className="flex-1 overflow-y-auto px-4 py-3">
                                {selectedPost.comments?.length > 0 ? (
                                    selectedPost.comments.map((comment) => (
                                        <div key={comment.id} className="mb-4">
                                            {/* Comment cha */}
                                            <div
                                                className="flex items-start space-x-3 relative group"
                                                onMouseEnter={() => setHoveredCommentId(comment.id)}
                                                onMouseLeave={() => setHoveredCommentId(null)}
                                            >
                                                <img src={comment.user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                                                <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                                                    <h5 className="text-sm font-semibold">{comment.user.name}</h5>
                                                    {editingCommentId === comment.id ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                value={editingContent}
                                                                onChange={(e) => setEditingContent(e.target.value)}
                                                                className="w-full p-2 border rounded resize-none text-sm"
                                                            />
                                                            <div className="flex space-x-2 mt-1">
                                                                <button onClick={() => handleUpdateComment(comment.id)} className="text-white bg-blue-500 px-3 py-1 rounded text-sm">Lưu</button>
                                                                <button onClick={() => { setEditingCommentId(null); setEditingContent(''); }} className="text-gray-500 text-sm">Hủy</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                                        <button className="hover:underline">Thích</button>
                                                        <button onClick={() => { setReplyToCommentId(comment.id); setReplyContent(''); }} className="hover:underline">Phản hồi</button>
                                                        <span>2 giờ trước</span>
                                                    </div>
                                                </div>

                                                {/* Dấu ba chấm cho comment cha */}
                                                {hoveredCommentId === comment.id && (
                                                    <div className="absolute top-2 right-2">
                                                        <button onClick={() => toggleCommentOptionsModal(comment.id)} className="text-gray-400 hover:text-gray-600">
                                                            <IoEllipsisHorizontal size={18} />
                                                        </button>
                                                        {openCommentOptionsId === comment.id && (
                                                            <div className="absolute top-6 right-0 bg-white border rounded shadow-md z-10">
                                                                <button onClick={() => handleDeleteComment(comment.id)} className="px-4 py-2 hover:bg-red-100 text-red-500 text-sm">Xoá</button>
                                                                <button onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); setOpenCommentOptionsId(null); }} className="px-4 py-2 hover:bg-blue-100 text-blue-500 text-sm">Sửa</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Form phản hồi cho comment cha */}
                                            {replyToCommentId === comment.id && (
                                                <div className="mt-2 ml-12 space-y-2">
                                                    <textarea
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        placeholder="Viết phản hồi..."
                                                        className="w-full p-2 border rounded resize-none text-sm"
                                                    />
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleReplySubmit(comment.id)} className="text-white bg-green-500 px-3 py-1 rounded text-sm">Gửi</button>
                                                        <button onClick={() => { setReplyToCommentId(null); setReplyContent(''); }} className="text-gray-500 text-sm">Hủy</button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Replies ẩn/hiện */}
                                            {comment.replies?.length > 0 && (
                                                <>
                                                    {!openReplies.includes(comment.id) ? (
                                                        <button
                                                            onClick={() => toggleReplies(comment.id)}
                                                            className="ml-12 text-sm text-blue-500 hover:underline mt-2"
                                                        >
                                                            Xem {comment.replies.length} phản hồi
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {flattenReplies(comment.replies).map((reply, index) => (
                                                                <div
                                                                    key={reply.id}
                                                                    className={`relative ml-12 pl-6 mb-4 group flex items-start ${index === 0 ? 'mt-3' : ''}`}
                                                                    onMouseEnter={() => setHoveredCommentId(reply.id)}
                                                                    onMouseLeave={() => setHoveredCommentId(null)}
                                                                >
                                                                    {/* Đường line + bo cong trái */}
                                                                    <div className="absolute left-0 top-0 w-6 h-full">
                                                                        <div className="absolute left-2 top-5 bottom-0 w-px bg-gray-400 group-hover:bg-blue-400 transition-colors duration-200" />
                                                                        <div className="absolute left-0 top-2 w-3 h-3 border-t border-l border-gray-400 rounded-tl-md group-hover:border-blue-400 transition-colors duration-200" />
                                                                    </div>

                                                                    {/* Avatar reply */}
                                                                    <img
                                                                        src={reply.user.avatar}
                                                                        className="w-8 h-8 rounded-full z-10 bg-white border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                                                                    />

                                                                    {/* Nội dung reply */}
                                                                    <div className="ml-2 bg-gray-100 p-3 rounded-xl shadow-sm w-full relative">
                                                                        <h6 className="text-sm font-semibold">{reply.user.name}</h6>
                                                                        <p className="text-sm text-gray-800">{reply.content}</p>
                                                                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                                                            <button className="hover:underline">Thích</button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setReplyToCommentId(reply.id);
                                                                                    setReplyContent('');
                                                                                }}
                                                                                className="hover:underline"
                                                                            >
                                                                                Phản hồi
                                                                            </button>
                                                                            <span>1 giờ trước</span>
                                                                        </div>

                                                                        {/* Menu 3 chấm */}
                                                                        {hoveredCommentId === reply.id && (
                                                                            <div className="absolute top-2 right-2">
                                                                                <button
                                                                                    onClick={() => toggleCommentOptionsModal(reply.id)}
                                                                                    className="text-gray-400 hover:text-gray-600"
                                                                                >
                                                                                    <IoEllipsisHorizontal size={18} />
                                                                                </button>
                                                                                {openCommentOptionsId === reply.id && (
                                                                                    <div className="absolute top-6 right-0 bg-white border rounded shadow-md z-10">
                                                                                        <button
                                                                                            onClick={() => handleDeleteComment(reply.id)}
                                                                                            className="px-4 py-2 hover:bg-red-100 text-red-500 text-sm"
                                                                                        >
                                                                                            Xoá
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setEditingCommentId(reply.id);
                                                                                                setEditingContent(reply.content);
                                                                                                setOpenCommentOptionsId(null);
                                                                                            }}
                                                                                            className="px-4 py-2 hover:bg-blue-100 text-blue-500 text-sm"
                                                                                        >
                                                                                            Sửa
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* ✅ FORM phản hồi được căn lề và bo đường line giống reply */}
                                                            {replyToCommentId && flattenReplies(comment.replies).some(r => r.id === replyToCommentId) && (
                                                                <div className="relative ml-12 pl-6 mb-4 flex items-start mt-2">
                                                                    {/* Line và cong giống reply */}
                                                                    <div className="absolute left-0 top-0 w-6 h-full">
                                                                        <div className="absolute left-2 top-5 bottom-0 w-px bg-gray-400" />
                                                                        <div className="absolute left-0 top-2 w-3 h-3 border-t border-l border-gray-400 rounded-tl-md" />
                                                                    </div>

                                                                    {/* Avatar ảo hoặc placeholder (tuỳ bạn chọn) */}
                                                                    <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm"></div>

                                                                    {/* Form */}
                                                                    <div className="ml-2 bg-white border border-gray-300 p-3 rounded-xl shadow-sm w-full">
                                                                        <textarea
                                                                            value={replyContent}
                                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                                            placeholder="Viết phản hồi..."
                                                                            className="w-full p-2 border rounded resize-none text-sm"
                                                                        />
                                                                        <div className="flex space-x-2 mt-2">
                                                                            <button
                                                                                onClick={() => handleReplySubmit(replyToCommentId)}
                                                                                className="text-white bg-green-500 px-3 py-1 rounded text-sm"
                                                                            >
                                                                                Gửi
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setReplyToCommentId(null);
                                                                                    setReplyContent('');
                                                                                }}
                                                                                className="text-gray-500 text-sm"
                                                                            >
                                                                                Hủy
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}

                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-gray-500">Chưa có bình luận nào.</p>
                                )}
                            </div>

                            <div className="border-t px-4 py-3 flex items-center relative">
                                <input
                                    type="text"
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder="Viết bình luận..."
                                    className="flex-1 px-3 py-2 border rounded-full outline-none"
                                />

                                {/* Nút emoji */}
                                <button
                                    className="ml-2 text-xl text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <FaSmile />
                                </button>

                                {/* Nút gửi */}
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={isSending}
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                                >
                                    {isSending ? "Đang gửi..." : "Gửi"}
                                </button>

                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div
                                        className="fixed z-[9999]"
                                        style={{
                                            bottom: "160px", // điều chỉnh cho hợp với modal comment
                                            right: "calc(50% - 600px)", // căn giữa modal 700px
                                        }}
                                    >
                                        <div className="relative">
                                            {/* Mũi tên hướng lên giống Facebook */}
                                            <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-300 shadow z-10" />
                                            <EmojiPicker
                                                onEmojiClick={handleEmojiClick}
                                                theme="light"
                                                height={350}
                                                width={300}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>


                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
