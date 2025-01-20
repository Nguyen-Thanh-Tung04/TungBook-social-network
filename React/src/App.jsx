import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Component/Client/Layouts/Layout';
import Login from './Component/Client/Auth/login';
import Home from './Component/Client/Home';
import Regester from './Component/Client/Auth/Regester';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Layout bao bọc các route cần Header và Footer */}
        <Route path="/" element={<Layout />}>
          {/* Đặt Home làm trang mặc định */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="regester" element={<Regester />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
