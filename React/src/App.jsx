import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Component/Client/Layouts/Layout';
import Login from './Component/Client/Auth/login';
import Home from './Component/Client/Home';
import Regester from './Component/Client/Auth/Regester';
import Profile from './Component/Client/Auth/Profile';
import StoryDetail from './Component/Client/StoryDetail';
import Chat from './Component/Client/Chat';
import Friends from './Component/Client/Friends';
import Groups from './Component/Client/Groups'; 
import GroupsDetail from './Component/Client/GroupsDetail';


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
          <Route path="profile" element={<Profile />} />
          <Route path="StoryDetail" element={<StoryDetail />} />
          <Route path="chat" element={<Chat />} /> 
          <Route path="friends" element={<Friends />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupsDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
