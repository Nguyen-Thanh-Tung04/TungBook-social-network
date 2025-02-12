import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Dùng để chuyển hướng

    // Kiểm tra nếu đã đăng nhập
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/home"); // Nếu đã đăng nhập, chuyển hướng về trang home
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !password) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    email,
                    password,
                }
            );

            if (response.data.message === "Login successful") {
                alert("Đăng nhập thành công!");
                setMessage("Đăng nhập thành công!");
                localStorage.setItem("authToken", response.data.token);
                navigate("/home");
            } else {
                setError(response.data.message || "Đăng nhập thất bại.");
            }
        } catch (err) {
            if (err.response) {
                // Nếu server trả về lỗi
                if (err.response.status === 401) {
                    setError("Email hoặc mật khẩu không đúng.");
                } else {
                    setError(
                        err.response.data.message ||
                            "Đã xảy ra lỗi. Vui lòng thử lại."
                    );
                }
            } else {
                // Nếu lỗi không phải từ server (ví dụ lỗi kết nối)
                setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white" style={{ width: "60vw", height: "40vh" }}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Đăng Nhập
            </h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Mật khẩu:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {message && (
                    <p className="text-green-500 text-sm mb-4">{message}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Đăng Nhập
                </button>
            </form>
            <a href=""  className=" text-red-600">Quên mật khẩu</a>
        </div>
    );
};

export default Login;
