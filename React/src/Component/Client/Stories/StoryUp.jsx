import React, { useState } from "react";

function StoryUp() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Hiển thị ảnh tải lên
    }
  };

  return (
    <div className="flex bg-gray-900 w-full">
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
          <p className="text-sm text-gray-400">Cập nhật tin của bạn</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button className="bg-blue-500 py-2 px-4 rounded-lg text-white">Thêm văn bản</button>
          <button className="bg-blue-500 py-2 px-4 rounded-lg text-white">Chia sẻ lên tin</button>
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl text-white mb-6">Tạo tin</h1>

        {/* Ẩn phần tạo tin dạng ảnh nếu đã chọn ảnh */}
        {!image && (
          <div className="flex justify-center items-center space-x-4">
            {/* Tạo tin dạng ảnh */}
            <div className="relative w-64 h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-white text-lg font-semibold">Tạo tin dạng ảnh</span>
            </div>
          </div>
        )}

        {/* Hiển thị ảnh đã chọn */}
        {image && (
          <div className="mt-6 w-full flex justify-center">
            <div className="relative w-96 h-96 bg-black rounded-lg border-4 border-white flex items-center justify-center overflow-hidden">
              <img
                src={image}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white bg-black px-2 py-1 rounded-lg text-sm">
                Chọn ảnh để cắt và xoay
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryUp;
