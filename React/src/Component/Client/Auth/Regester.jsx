import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Từ điển dịch lỗi
const errorMessages = {
    "The email has already been taken.": "Email đã được sử dụng.",
    "The username has already been taken.": "Tên người dùng đã được sử dụng.",
    "The password confirmation does not match.":
        "Mật khẩu xác nhận không khớp.",
    "Validation error": "Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.",
    "Vui lòng điền đầy đủ thông tin.": "Vui lòng điền đầy đủ thông tin.",
    "Mật khẩu xác nhận không khớp.": "Mật khẩu xác nhận không khớp.",
};

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roleId, setRoleId] = useState(""); // Optional role_id
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!username || !email || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/register",
                {
                    username,
                    email,
                    password,
                    password_confirmation: confirmPassword, // Backend yêu cầu password_confirmation
                    role_id: roleId || null, // role_id là tùy chọn
                }
            );

            if (response.status === 201) {
                setMessage("Đăng ký thành công!");
                alert("Đăng ký thành công!");
                navigate("/login"); // Chuyển hướng sang trang đăng nhập
            }
        } catch (err) {
            if (err.response && err.response.data) {
                // Lỗi từ server
                setError(
                    err.response.data.message ||
                        "Đăng ký thất bại. Vui lòng thử lại."
                );
            } else {
                // Lỗi kết nối hoặc không rõ nguyên nhân
                setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
            }
        }
    };

    return (
       <div>
         <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white" style={{ width: "50vw"    }}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Đăng ký
            </h2>
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Tên người dùng:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

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

                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Xác nhận mật khẩu:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {message && (
                    <p className="text-green-500 text-sm mb-4">{message}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                >
                    Đăng ký
                </button>
                <div className="mt-4 text-center">
                    <a href="login" className="text-blue-500 text-sm">
                        Bạn đã có tài khoản rồi ư?
                    </a>
                </div>
            </form>
        </div>
       </div>
    );
};

export default Register;
