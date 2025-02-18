import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Kiểm tra nếu đã đăng nhập
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/home");
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
                if (err.response.status === 401) {
                    setError("Email hoặc mật khẩu không đúng.");
                } else {
                    setError(
                        err.response.data.message ||
                        "Đã xảy ra lỗi. Vui lòng thử lại."
                    );
                }
            } else {
                setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center " style={{ width: "1280px" }}>
            {/* Facebook Logo và mô tả */}
            <div className="flex items-center justify-center w-1/2">
                <div>
                    <h1 className="text-6xl font-bold text-blue-600 mb-4">
                        Tungbook
                    </h1>
                    <p className="text-xl text-gray-700">
                        Tungbook giúp bạn kết nối và chia sẻ với mọi người trong
                        cuộc sống của bạn.
                    </p>
                </div>
            </div>

            {/* Form đăng nhập */}
            <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email hoặc số điện thoại"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm mb-4">{message}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-bold text-lg"
                    >
                        Đăng nhập
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="forgot-password" className="text-blue-500 text-sm">
                        Quên mật khẩu?
                    </a>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                    <a
                        href="/regester"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 font-bold text-lg text-center block"
                    >
                        Tạo tài khoản mới
                    </a>

                </div>
            </div>
        </div>
    );
};

export default Login;
