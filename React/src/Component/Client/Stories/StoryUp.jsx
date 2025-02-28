import React, { useState } from "react";
import Draggable from "react-draggable";

function StoryUp() {
    const [image, setImage] = useState(null);
    const [texts, setTexts] = useState([]); // Danh sách các đoạn văn bản
    const [newText, setNewText] = useState(""); // Văn bản nhập vào

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Hiển thị ảnh tải lên
        }
    };

    const handleAddText = () => {
        if (newText.trim() !== "") {
            setTexts([...texts, { id: texts.length, text: newText }]);
            setNewText(""); // Xóa input sau khi thêm
        }
    };

    const handleRemoveText = (id) => {
        setTexts(texts.filter((text) => text.id !== id)); // Xóa văn bản khỏi danh sách
    };

    return (
        <div className="flex bg-gray-900 w-full h-screen">
            {/* Sidebar bên trái */}
            <div className="w-1/4 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-semibold mb-6">Tin của bạn</h2>
                <div className="mb-4">
                    <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full mb-2"
                    />
                    <p className="font-semibold">Nguyễn Thanh Tùng</p>
                    <p className="text-sm text-gray-400">
                        Cập nhật tin của bạn
                    </p>
                </div>
                <div className="flex flex-col space-y-4">
                    {/* Input để nhập văn bản */}
                    <input
                        type="text"
                        placeholder="Nhập văn bản..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="p-2 rounded-lg text-black w-full"
                    />
                    {/* Thêm văn bản vào ảnh */}
                    <button
                        onClick={handleAddText}
                        className="bg-blue-500 py-2 px-4 rounded-lg text-white"
                    >
                        Thêm văn bản
                    </button>
                    {/* Nút chia sẻ */}
                    <div className="flex space-x-2 mt-4 w-full">
                        {/* Nút "Bỏ" nhỏ hơn, chiếm ít diện tích hơn */}
                        <button
                            className="bg-gray-300 py-2 px-3 rounded-lg text-black text-sm w-1/3"
                            onClick={() => window.history.back()}
                        >
                            Bỏ
                        </button>

                        {/* Nút "Chia sẻ lên tin" lớn hơn, chiếm phần còn lại */}
                        <button className="bg-blue-500 py-2 px-4 rounded-lg text-white w-2/3">
                            Chia sẻ lên tin
                        </button>
                    </div>
                </div>
            </div>

            {/* Nội dung bên phải */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl text-white mb-6">Tạo tin</h1>

                {/* Chọn ảnh nếu chưa có */}
                {!image && (
                    <div className="flex justify-center items-center space-x-4">
                        <div className="relative w-64 h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <span className="text-white text-lg font-semibold">
                                Tạo tin dạng ảnh
                            </span>
                        </div>
                    </div>
                )}

                {/* Hiển thị ảnh và văn bản kéo thả */}
                {image && (
                    <div className="w-full flex justify-center">
                        {/* Thẻ bọc ngoài để căn chỉnh layout */}
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md w-[450px] relative">
                            <h2 className="text-white text-lg font-semibold mb-2">
                                Xem trước
                            </h2>

                            {/* Nút X để xóa ảnh */}
                            <button
                                onClick={() => setImage(null)} // Xóa ảnh hiện tại
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                            >
                                ❌
                            </button>

                            <div className="mt-6 w-full flex justify-center">
                                <div className="relative w-96 h-96 bg-black rounded-lg border-4 border-white flex items-center justify-center overflow-hidden">
                                    {/* Ảnh được tải lên */}
                                    <img
                                        src={image}
                                        alt="Selected"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Các đoạn văn bản có thể kéo thả */}
                                    {texts.map((item) => (
                                        <Draggable key={item.id}>
                                            <div
                                                className="absolute px-4 py-2 bg-white text-black rounded-lg cursor-move shadow-md flex items-center space-x-2"
                                                style={{
                                                    top: "50%",
                                                    left: "50%",
                                                }} // Vị trí mặc định
                                            >
                                                <span>{item.text}</span>
                                                {/* Nút xóa văn bản */}
                                                <button
                                                    onClick={() =>
                                                        handleRemoveText(
                                                            item.id
                                                        )
                                                    }
                                                    className="text-red-500 font-bold text-lg hover:text-red-700"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        </Draggable>
                                    ))}
                                </div>
                            </div>

                            {/* Chú thích bên dưới */}
                            <p className="text-gray-300 text-center mt-3 text-sm">
                                Chọn ảnh để cắt và xoay
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StoryUp;
