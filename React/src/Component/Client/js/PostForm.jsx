// PostModal.jsx
import React from "react";

const PostModal = ({
  isPostModalOpen,
  togglePostModal,
  postContent,
  handlePostChange,
  handlePostSubmit,
  handleFileChange,
  files,
  handleRemoveImage
}) => {
  return (
    <div className="relative w-full ">
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

            <form onSubmit={handlePostSubmit}>
              <textarea
                value={postContent}
                onChange={handlePostChange}
                placeholder="hôm nay đẹp trời"
                className="w-full p-2 mb-4 bg-gray-100 rounded-md h-24 border-none outline-none resize-none"
              />
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
                    {/* Hiển thị danh sách file */}
                    {files.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
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
              <div className="flex items-center justify-between">
                <button
                  type="submit"
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
  );
};

export default PostModal;
