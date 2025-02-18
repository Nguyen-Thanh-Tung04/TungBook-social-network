import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email hoặc số điện thoại:", email);
    // Thêm logic xử lý gửi yêu cầu tìm kiếm tài khoản tại đây
  };

  return (
    <div className="flex items-center justify-center" style={{ width: "1280px" }}>
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Tìm tài khoản của bạn
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Vui lòng nhập email hoặc số di động để tìm kiếm tài khoản của bạn.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email hoặc số di động"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between mt-4">
          <a
  href="/login"
  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-center"
>
  Hủy
</a>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
