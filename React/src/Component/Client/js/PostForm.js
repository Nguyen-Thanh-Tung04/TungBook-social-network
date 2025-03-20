// PostForm.js
import React, { useState } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";

const PostForm = ({ isOpen, toggleModal, fetchPosts }) => {
    const [postContent, setPostContent] = useState("");
    const [files, setFiles] = useState([]);

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
            await axios.post("http://127.0.0.1:8000/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });

            toggleModal();
            await fetchPosts(); // Cập nhật danh sách bài viết
        } catch (error) {
            console.error(
                "Lỗi khi gửi request:",
                error.response ? error.response.data : error
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-4 rounded-lg shadow-lg relative w-96">
                <button
                    onClick={toggleModal}
                    className="absolute top-2 right-2 text-black text-3xl"
                >
                    &times;
                </button>

                <h2 className="text-lg font-semibold mb-4">Tạo bài viết mới</h2>

                <textarea
                    value={postContent}
                    onChange={handlePostChange}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Bạn đang nghĩ gì?"
                />

                <input type="file" multiple onChange={handleFileChange} />

                <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-16 h-16 object-cover rounded"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePostSubmit}
                    className="mt-4 bg-blue-500 text-white p-2 rounded w-full flex items-center justify-center"
                >
                    <IoSend className="mr-2" /> Đăng bài
                </button>
            </div>
        </div>
    );
};

export default PostForm;
