import React, { useEffect, useRef, useState } from "react";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaGoogle,
    FaLinkedin,
} from "react-icons/fa"; // Các biểu tượng mạng xã hội
import axios from "axios";
import PostForm from "../js/PostForm";
import ListPostUser from "../js/listPostUser";



function ProfilePage() {
    const [activeTab, setActiveTab] = useState("first");

    // Tab con trong "Friends"
    const [activeSubTab, setActiveSubTab] = useState("all");
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [userData, setUserData] = useState({
        name: '',
        avatar_url: '',
        posts: 0,
        followers: 0,
        following: 0,
    });

    // thông tin cá nhân 
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Cho modal thông tin cá nhân
    const [formData, setFormData] = useState({
        title: 'Tùng',
        job: 'Dev',
        education: 'Cao đẳng FPT Polytechnic'
    });

    // Toggle modal visibility
    const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Tab bạn bè 
    // Hàm thay đổi tab con trong "Friends"
    const handleSubTabClick = (tab) => {
        setActiveSubTab(tab);
    };

    // Dữ liệu bạn bè (mô phỏng)
    const friendsData = {
        all: [
            {
                name: "Petey Cruiser",
                friends: "15 friends",
                img: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
                name: "Anna Sthesia",
                friends: "50 friends",
                img: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            {
                name: "Paul Molive",
                friends: "10 friends",
                img: "https://randomuser.me/api/portraits/men/2.jpg",
            },
            {
                name: "Gail Forcewind",
                friends: "20 friends",
                img: "https://randomuser.me/api/portraits/women/2.jpg",
            },
            {
                name: "Paige Turner",
                friends: "12 friends",
                img: "https://randomuser.me/api/portraits/men/3.jpg",
            },
            {
                name: "b Frapples",
                friends: "6 friends",
                img: "https://randomuser.me/api/portraits/women/3.jpg",
            },
        ],
        recentlyAdded: [
            {
                name: "Gail Forcewind",
                friends: "20 friends",
                img: "https://randomuser.me/api/portraits/women/2.jpg",
            },
            {
                name: "Paige Turner",
                friends: "12 friends",
                img: "https://randomuser.me/api/portraits/men/3.jpg",
            },
        ],
        closeFriends: [
            {
                name: "Paul Molive",
                friends: "10 friends",
                img: "https://randomuser.me/api/portraits/men/2.jpg",
            },
            {
                name: "Anna Sthesia",
                friends: "50 friends",
                img: "https://randomuser.me/api/portraits/women/1.jpg",
            },
        ],
        homeTown: [
            {
                name: "Gail Forcewind",
                friends: "20 friends",
                img: "https://randomuser.me/api/portraits/women/2.jpg",
            },
        ],
        following: [
            {
                name: "Petey Cruiser",
                friends: "15 friends",
                img: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
                name: "b Frapples",
                friends: "6 friends",
                img: "https://randomuser.me/api/portraits/women/3.jpg",
            },
        ],
    };

    // Button bạn bè 
    const [isOpen, setIsOpen] = useState(false);

    // Modal ảnh đại diện
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const avatarRef = useRef(null);

    const toggleAvatarModal = () => {
        if (avatarRef.current) {
            const rect = avatarRef.current.getBoundingClientRect();
            setModalPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX,
            });
        }
        setIsAvatarModalOpen(!isAvatarModalOpen);
    };

    const handleViewAvatar = () => {
        setIsImageModalOpen(true);
        setIsAvatarModalOpen(false);
    };

    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    const handleUploadAvatar = async () => {
        const file = fileInputRef.current.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/user/avatar",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Avatar updated successfully!");

            // Cập nhật avatarPreview để hiển thị ảnh mới
            setAvatarPreview(URL.createObjectURL(file));

            // Đóng modal
            setIsFileModalOpen(false);
            setIsAvatarModalOpen(false);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    const handleChooseAvatar = () => {
        setIsFileModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setIsImageModalOpen(false);
    };

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


    //  đăng Bài viết 
    const [isPostModalOpen, setIsPostModalOpen] = useState(false); // Cho modal đăng bài viết
    const [postContent, setPostContent] = useState("");
    const [files, setFiles] = useState([]);
    const togglePostModal = () => setIsPostModalOpen(!isPostModalOpen);


    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            (file) => file instanceof File
        );
        setFiles(selectedFiles);
    };

    const handleRemoveImage = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Fetch bài viết
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/posts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts(); // ✅ Gọi sau khi khai báo
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("type_id", 1);
        formData.append("content", postContent);

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
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Response từ server:", response.data);
            togglePostModal();
            await fetchPosts();
        } catch (error) {
            console.error(
                "Lỗi khi gửi request:",
                error.response ? error.response.data : error
            );
        }
    };

    return (
        <div className=" bg-gray-100 min-h-fit ">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 flex items-center justify-between relative">
                <div className="flex items-center">
                    <img
                        ref={avatarRef}
                        src={avatarPreview || userData?.avatar_url || 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/430028095_1758861091286933_7708332768369038985_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHe4DTpbgymh3ve45vOO9iOJrbBaxDj87QmtsFrEOPztDUYQ7OYmp0HgJgDKax5xCYXQ4XAE0toaxhN-Keq3fcP&_nc_ohc=StIE3wkzbkIQ7kNvgHZX9fC&_nc_oc=Adk4jWxUg0SCKCbUa-5T2EiIf4_S4rxqfgZwwLKsz0qt9ZlkAIIwESzh0CnwdpuIQK4&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=5rVn09AEmF7Qt1jJA3a1lA&oh=00_AYHA91Oda2kvtNjXtwejlCK1m5kJiANeG3t5fY5_SpamxA&oe=67F069EF'}
                        alt="User Avatar"
                        className="w-40 h-40 rounded-full border-4 border-white cursor-pointer"
                        onClick={toggleAvatarModal}
                    />
                    <div className="ml-4 text-white">
                        <h1 className="text-2xl font-semibold">Thanh Tùng</h1>
                        <div className="text-sm">
                            Posts: 690 | Followers: 206 | Following: 100
                        </div>
                    </div>
                </div>

                {isAvatarModalOpen && (
                    <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 transform -translate-x-1/2" style={{ top: "200px", left: "200px" }}>
                        <button className="block w-full text-left p-2 hover:bg-gray-100" onClick={handleViewAvatar}>Xem ảnh đại diện</button>
                        <button className="block w-full text-left p-2 hover:bg-gray-100" onClick={handleChooseAvatar}>Chọn ảnh đại diện</button>
                    </div>
                )}
            </div>

            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div className="relative w-auto max-w-5xl">
                        <button onClick={handleCloseImageModal} className="absolute top-2 right-2 text-white text-3xl">&times;</button>
                        <img
                            src={avatarPreview || userData?.avatar_url || 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/430028095_1758861091286933_7708332768369038985_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHe4DTpbgymh3ve45vOO9iOJrbBaxDj87QmtsFrEOPztDUYQ7OYmp0HgJgDKax5xCYXQ4XAE0toaxhN-Keq3fcP&_nc_ohc=StIE3wkzbkIQ7kNvgHZX9fC&_nc_oc=Adk4jWxUg0SCKCbUa-5T2EiIf4_S4rxqfgZwwLKsz0qt9ZlkAIIwESzh0CnwdpuIQK4&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=5rVn09AEmF7Qt1jJA3a1lA&oh=00_AYHA91Oda2kvtNjXtwejlCK1m5kJiANeG3t5fY5_SpamxA&oe=67F069EF'}
                            alt="Avatar Detail"
                            className="w-[800px] h-auto max-h-[90vh] rounded-lg"
                        />
                    </div>
                </div>
            )}


            {/* Modal chọn ảnh đại diện */}
            {isFileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-white p-4 rounded-lg shadow-lg relative">
                        <button onClick={() => setIsFileModalOpen(false)} className="absolute top-2 right-2 text-black text-3xl">&times;</button>

                        <h2 className="text-lg font-semibold mb-4">Chọn ảnh đại diện mới</h2>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="mb-4"
                        />

                        {avatarPreview && (
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="w-32 h-32 object-cover rounded-full mb-4"
                            />
                        )}

                        <button
                            onClick={handleUploadAvatar}
                            className="p-2 bg-blue-500 text-white rounded-lg"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            )}

            {/* Tab Menu */}
            <div className="flex justify-center mb-4 py-7">
                <div className="bg-white w-full rounded-lg shadow-md flex">
                    <button
                        onClick={() => setActiveTab("first")}
                        className={`w-full py-2 px-4 transition-colors duration-300 ${activeTab === "first"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        Timeline
                    </button>
                    <button
                        onClick={() => setActiveTab("second")}
                        className={`w-full py-2 px-4  transition-colors duration-300 ${activeTab === "second"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        About
                    </button>
                    <button
                        onClick={() => setActiveTab("third")}
                        className={`w-full py-2 px-4  transition-colors duration-300 ${activeTab === "third"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        Friends
                    </button>
                    <button
                        onClick={() => setActiveTab("forth")}
                        className={`w-full py-2 px-4 transition-colors duration-300 ${activeTab === "forth"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-600 hover:bg-blue-500 hover:text-white"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        Photos
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 ">
                {activeTab === "first" && (
                    <div>
                        <div className="min-h-screen bg-gray-100 text-gray-600 flex max-w-[1120px]">
                            {/* Sidebar */}
                            <div className="w-1/4 bg-gray-100 p-4">
                                {/* Profile info */}
                                <div className="mb-6 bg-white p-4 rounded shadow-md">
                                    <h2 className="text-lg font-semibold">Giới thiệu</h2>
                                    <p className="text-sm mt-2">"Perfectly imperfect"</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li>{`Danh xưng: ${formData.title}`}</li>
                                        <li>{`Công việc: ${formData.job}`}</li>
                                        <li>{`Học vấn: ${formData.education}`}</li>
                                    </ul>
                                    <button
                                        onClick={toggleInfoModal}
                                        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
                                    >
                                        Chỉnh sửa chi tiết
                                    </button>
                                </div>

                                {/* Modal for editing profile */}
                                {isInfoModalOpen && (
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white p-6 rounded-lg w-1/3">
                                            <h3 className="text-xl font-semibold mb-4">Chỉnh sửa chi tiết</h3>
                                            <form>
                                                <div className="mb-4">
                                                    <label className="block text-sm">Danh xưng</label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        className="mt-1 px-4 py-2 border border-gray-300 rounded w-full"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm">Công việc</label>
                                                    <input
                                                        type="text"
                                                        name="job"
                                                        value={formData.job}
                                                        onChange={handleChange}
                                                        className="mt-1 px-4 py-2 border border-gray-300 rounded w-full"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm">Học vấn</label>
                                                    <input
                                                        type="text"
                                                        name="education"
                                                        value={formData.education}
                                                        onChange={handleChange}
                                                        className="mt-1 px-4 py-2 border border-gray-300 rounded w-full"
                                                    />
                                                </div>

                                                <div className="flex justify-between mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={toggleInfoModal}
                                                        className="bg-gray-300 text-black px-4 py-2 rounded"
                                                    >
                                                        Hủy
                                                    </button>
                                                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                                        Lưu
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white p-4 rounded shadow-md">
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            Photos
                                        </h2>
                                        <button
                                            onClick={() => setActiveTab("forth")}
                                            className="text-blue-500 hover:underline text-sm">
                                            Add Photo
                                        </button>
                                    </div>

                                    {/* Photo Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <img
                                            src="https://randomuser.me/api/portraits/men/14.jpg"
                                            alt="Photo 1"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/9.jpg"
                                            alt="Photo 2"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/6.jpg"
                                            alt="Photo 3"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/15.jpg"
                                            alt="Photo 4"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/1.jpg"
                                            alt="Photo 5"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/52.jpg"
                                            alt="Photo 6"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/22.jpg"
                                            alt="Photo 7"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/5.jpg"
                                            alt="Photo 8"
                                            className="w-full h-auto rounded"
                                        />
                                        <img
                                            src="https://randomuser.me/api/portraits/men/66.jpg"
                                            alt="Photo 9"
                                            className="w-full h-auto rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 ">

                                <div className="flex items-center justify-between mb-4 bg-white p-3">
                                    <img
                                        src={avatarPreview || userData?.avatar_url || 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/430028095_1758861091286933_7708332768369038985_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHe4DTpbgymh3ve45vOO9iOJrbBaxDj87QmtsFrEOPztDUYQ7OYmp0HgJgDKax5xCYXQ4XAE0toaxhN-Keq3fcP&_nc_ohc=StIE3wkzbkIQ7kNvgHZX9fC&_nc_oc=Adk4jWxUg0SCKCbUa-5T2EiIf4_S4rxqfgZwwLKsz0qt9ZlkAIIwESzh0CnwdpuIQK4&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=5rVn09AEmF7Qt1jJA3a1lA&oh=00_AYHA91Oda2kvtNjXtwejlCK1m5kJiANeG3t5fY5_SpamxA&oe=67F069EF'}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full mr-4"
                                    />

                                    {<PostForm
                                        isPostModalOpen={isPostModalOpen}
                                        togglePostModal={togglePostModal}
                                        postContent={postContent}
                                        handlePostChange={handlePostChange}
                                        handlePostSubmit={handlePostSubmit}
                                        handleFileChange={handleFileChange}
                                        files={files}
                                        handleRemoveImage={handleRemoveImage}
                                        userData={userData}
                                    />}
                                </div>

                                {/* Bài viết  */}
                                <ListPostUser
                                    userData={userData}
                                    posts={posts}
                                    setPosts={setPosts}
                                    autoFetch={false}
                                />

                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "second" && (
                    <div>
                        <div className="min-h-screen bg-gray-100 text-gray-600 flex max-w-[1120px]">
                            {/* Sidebar */}
                            <div className="w-1/4 bg-white p-4 shadow-md">
                                <ul className="space-y-4">
                                    <li className="text-blue-500 font-semibold">
                                        Liên hệ và thông tin cơ bản
                                    </li>
                                    <li className="hover:text-blue-500 cursor-pointer">
                                        Sở thích và mối quan tâm
                                    </li>
                                    <li className="hover:text-blue-500 cursor-pointer">
                                        Gia đình và mối quan hệ
                                    </li>
                                    <li className="hover:text-blue-500 cursor-pointer">
                                        Công việc và Giáo dục
                                    </li>
                                    <li className="hover:text-blue-500 cursor-pointer">
                                        Những nơi bạn đã sống
                                    </li>
                                </ul>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 bg-white shadow-md rounded">
                                <h2 className="text-xl font-semibold mb-4">
                                    Thông tin cá nhân
                                </h2>
                                <div className="space-y-4">
                                    <p>
                                        <span className="font-semibold">
                                            Giới thiệu về tôi :{" "}
                                        </span>
                                        Xin chào , tôi là Tùng 20 Tuổi là 1 lập
                                        trình viên trong lĩnh vực lập trình web
                                        . Hân hạnh được chào bạn !
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Email:{" "}
                                        </span>
                                        Tung@gmail.com
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Mobile:{" "}
                                        </span>
                                        (001) 4544 565 456
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Address:{" "}
                                        </span>
                                        Hưng Yên
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Social Link:{" "}
                                        </span>
                                        www.bootstrap.com
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Birth Date:{" "}
                                        </span>
                                        24 January
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Birth Year:{" "}
                                        </span>
                                        2004
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Birthplace:{" "}
                                        </span>
                                        Austin, Texas, USA
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Lives in:{" "}
                                        </span>
                                        San Francisco, California, USA
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Gender:{" "}
                                        </span>
                                        Female
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Interested in:{" "}
                                        </span>
                                        Designing
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Language:{" "}
                                        </span>
                                        English, French
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Joined:{" "}
                                        </span>
                                        April 31st, 2014
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Status:{" "}
                                        </span>
                                        Married
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Phone Number:{" "}
                                        </span>
                                        (044) 555 - 4369 - 8957
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Political Incline:{" "}
                                        </span>
                                        Democrat
                                    </p>
                                </div>
                                <hr className="my-4" />
                                <h2 className="text-xl font-semibold mb-4">
                                    Websites and Social Links
                                </h2>
                                <p>
                                    <span className="font-semibold">
                                        Website:{" "}
                                    </span>
                                    www.bootstrap.com
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Social Link:{" "}
                                    </span>
                                    www.bootstrap.com
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "third" && (
                    <div>
                        <div className="min-h-screen bg-gray-100 p-6 " style={{ width: "1120px" }} >
                            <div className="bg-white p-6 rounded shadow-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Friends
                                </h2>
                                {/* Tab con trong Friends */}
                                <div className="flex space-x-6 text-gray-600 mb-6">
                                    <a
                                        href="#"
                                        onClick={() => handleSubTabClick("all")}
                                        className={`text-blue-500 font-semibold ${activeSubTab === 'all' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                                    >
                                        All Friends
                                    </a>
                                    <a
                                        href="#"
                                        onClick={() => handleSubTabClick("recentlyAdded")}
                                        className={`hover:text-blue-500 ${activeSubTab === 'recentlyAdded' ? 'text-blue-500' : ''}`}
                                    >
                                        Recently Added
                                    </a>
                                    <a
                                        href="#"
                                        onClick={() => handleSubTabClick("closeFriends")}
                                        className={`hover:text-blue-500 ${activeSubTab === 'closeFriends' ? 'text-blue-500' : ''}`}
                                    >
                                        Close Friends
                                    </a>
                                    <a
                                        href="#"
                                        onClick={() => handleSubTabClick("homeTown")}
                                        className={`hover:text-blue-500 ${activeSubTab === 'homeTown' ? 'text-blue-500' : ''}`}
                                    >
                                        Home/Town
                                    </a>
                                    <a
                                        href="#"
                                        onClick={() => handleSubTabClick("following")}
                                        className={`hover:text-blue-500 ${activeSubTab === 'following' ? 'text-blue-500' : ''}`}
                                    >
                                        Following
                                    </a>
                                </div>

                                {/* Hiển thị bạn bè dựa trên tab con đã chọn */}
                                <div className="grid grid-cols-2 gap-6">
                                    {friendsData[activeSubTab]?.map((friend, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded shadow-sm bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={friend.img}
                                                    alt={friend.name}
                                                    className="w-16 h-16 rounded-full mr-4"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {friend.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {friend.friends}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                                                Friend
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "forth" && (
                    <div>
                        <div className="min-h-screen bg-gray-100 p-6 max-w-[1120px]" style={{ width: "1120px" }}>
                            <div className="bg-white p-6 rounded shadow-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Photos
                                </h2>
                                <div className="flex space-x-6 text-gray-600 mb-6">
                                    <a
                                        href="#"
                                        className="text-blue-500 font-semibold"
                                    >
                                        Photos of You
                                    </a>
                                    <a href="#" className="hover:text-blue-500">
                                        Your Photos
                                    </a>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        "https://picsum.photos/200/300?random=1",
                                        "https://picsum.photos/200/300?random=2",
                                        "https://picsum.photos/200/300?random=3",
                                        "https://picsum.photos/200/300?random=4",
                                        "https://picsum.photos/200/300?random=5",
                                        "https://picsum.photos/200/300?random=6",
                                        "https://picsum.photos/200/300?random=7",
                                        "https://picsum.photos/200/300?random=8",
                                    ].map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-auto rounded-lg shadow"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
