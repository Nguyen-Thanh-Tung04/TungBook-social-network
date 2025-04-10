// src/Component/Client/js/ListPostUser.jsx
import React, { useRef, useEffect, useState } from "react";
import { IoEllipsisHorizontal, IoSend } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import EmojiPicker from 'emoji-picker-react';
import { FaVideo, FaPhotoVideo, FaSmile } from "react-icons/fa"; // Import các icon cần dùng


const ListPostUser = ({
    userData,
    autoFetch = false, // tùy chọn fetch bài viết tự động
    posts: externalPosts = [],
    setPosts: setExternalPosts = () => { },
}) => {
    // 👇 Thêm state để điều khiển emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // 👇 Hàm khi chọn emoji
    const handleEmojiClick = (emojiData, event) => {
        setCommentInput(prev => prev + emojiData.emoji);
    };
    const [showLikesModal, setShowLikesModal] = useState(false);

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


    const [posts, setPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openPostOptionsId, setOpenPostOptionsId] = useState(null);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);

    // Optional: dùng state bên trong hoặc từ ngoài
    const postsToRender = autoFetch ? posts : externalPosts;
    const setPostsFinal = autoFetch ? setPosts : setExternalPosts;

    // Đồng bộ dữ liệu "cảm xúc" từ props.posts khi autoFetch = false
    useEffect(() => {
        if (!autoFetch && externalPosts.length > 0) {
            // Map cảm xúc của người dùng
            const reactionMap = {};
            externalPosts.forEach(post => {
                if (post.user_reaction) {
                    reactionMap[post.id] = post.user_reaction;
                }
            });
            setPostReactions(reactionMap);

            // Tổng hợp cảm xúc
            const summaries = {};
            externalPosts.forEach(post => {
                if (post.reaction_summary) {
                    summaries[post.id] = post.reaction_summary;
                }
            });
            setPostSummaries(summaries);
        }
    }, [externalPosts, autoFetch]);


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


    // Bình luận
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);


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
        console.log("Mở modal bình luận cho bài viết ID:", postId);
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
                                <div className="absolute bottom-14 right-0 z-50">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            )}
        </>
    );
};

export default ListPostUser;
