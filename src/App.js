import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Intro from "./components/Intro";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from "react-router-dom";
import Album from "./pages/Album";
import Create from "./pages/Create";
import MyPage from "./pages/MyPage";

function Layout({ children }) {
  return (
    <div>
      <Header /> {/* 인트로 페이지를 제외한 모든 페이지에 헤더가 포함됨 */}
      {children}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <title>MUSIC ON THE BLOCK</title>
      <Routes>
        <Route path="/" element={<Intro />} /> {/* 인트로에는 헤더 X */}
        <Route path="/Album" element={<Layout />} />
        <Route path="/create" element={<Create />}></Route>
        <Route path="/MyPage" element={<MyPage />} />
      </Routes>
    </div>
  );
}

export default App;
