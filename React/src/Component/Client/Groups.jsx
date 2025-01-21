import React from "react";

function Groups() {
  // Danh sách các nhóm giả lập
  const groups = [
    {
      id: 1,
      name: "Tuyển dụng thực tập IT",
      lastAccess: "22 tuần trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg", // Đường dẫn ảnh nhóm
    },
    {
      id: 2,
      name: "Code Đồ Án Công Nghệ Thông Tin (CNTT) & Lập Trình Web",
      lastAccess: "26 tuần trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
    {
      id: 3,
      name: "KHU PHỐ FREELANCER",
      lastAccess: "21 tuần trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
    {
      id: 4,
      name: "Chợ Đầu Mối Hoa Hà Nội",
      lastAccess: "2 năm trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
    {
      id: 5,
      name: "Tuyển Dụng Lập Trình PHP",
      lastAccess: "22 tuần trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
    {
      id: 6,
      name: "Mua bán Trao Đổi Điện Thoại",
      lastAccess: "1 năm trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
    {
      id: 7,
      name: "CÙNG NHAU LÀM GIÀU",
      lastAccess: "7 tuần trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
    {
      id: 8,
      name: "Hội thanh lý đồ cũ + mới giá rẻ tại Hà Nội",
      lastAccess: "51 tuần trước",
      image:
        "https://tiki.vn/blog/wp-content/uploads/2023/02/lPKE_pCPUMJVK6e5nw15EtS2yq1qKdfsYEGJP3LQ8-NwwldfzUgsGh_nf8HjuzjgtQCIaRtmZ6YQ7cl0rr6Aus5wPFbeIeTAl89FKboxeAR153J6vQHxcCRD39gOeuf6irvMilmMvBENqCQo_1vkfzI.jpg",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
        
      <h2 className="text-lg font-semibold mb-4">
        Tất cả các nhóm bạn đã tham gia ({groups.length})
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={group.image}
              alt={group.name}
              className="w-24 h-24 object-cover rounded-lg mb-2"
            />
            <h3 className="text-sm font-semibold text-gray-800 text-center">
              {group.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Lần truy cập gần đây nhất: {group.lastAccess}
            </p>
            <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600">
              Xem nhóm
            </button>
            <div className="mt-2 text-gray-500 cursor-pointer hover:text-gray-700">
              ...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;
