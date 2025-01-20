// Import các thư viện cần thiết
import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Chào mừng đến với Trang Chủ</h2>
          <p className="text-gray-600">Khám phá nội dung và dịch vụ mà chúng tôi cung cấp.</p>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Dịch Vụ 1</h3>
            <p className="text-gray-600">Mô tả ngắn gọn về dịch vụ.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Dịch Vụ 2</h3>
            <p className="text-gray-600">Mô tả ngắn gọn về dịch vụ.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Dịch Vụ 3</h3>
            <p className="text-gray-600">Mô tả ngắn gọn về dịch vụ.</p>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Home;
