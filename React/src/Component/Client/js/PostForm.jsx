import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

const PostModal = ({
  isPostModalOpen,
  togglePostModal,
  postContent,
  handlePostChange,
  handlePostSubmit,
  handleFileChange,
  files,
  handleRemoveImage,
  userData,
  editingPost,
  clearEditingPost
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    // Nối emoji vào cuối nội dung post
    handlePostChange({ target: { value: postContent + emoji } });
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Tùng ơi, bạn đang nghĩ gì thế?"
        className="flex-1 p-2 bg-gray-200 w-full text-gray-300 rounded-lg focus:outline-none border-none"
        onClick={togglePostModal}
      />

      {isPostModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={togglePostModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-3/6 max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={togglePostModal}
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
              {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}
            </h2>

            <form onSubmit={handlePostSubmit}>
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

                {/* Emoji Picker nổi trên toàn màn hình */}
                {showEmojiPicker && (
                  <div
                    className="fixed z-[9999]"
                    style={{
                      bottom: "200px", // giữ nguyên
                      right: "calc(50% - 630px)", // dịch sang phải thêm 50px so với trước
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

              {/* Upload file */}
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
                    {files.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={
                            typeof file === "string"
                              ? file // ảnh từ server đã là URL
                              : URL.createObjectURL(file) // file upload mới
                          }
                          alt="selected"
                          className="w-full rounded-lg"
                        />
                        <button
                          className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>Thêm ảnh/video hoặc kéo và thả</span>
                )}

              </div>

              {/* Nút đăng */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                >
                  {editingPost ? 'Cập nhật' : 'Đăng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostModal;
