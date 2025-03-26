import "./App.css";
// 라이브러리
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// 페이지
import Album from "./pages/Album";
import Create from "./pages/Create";
import MyPage from "./pages/MyPage";
import AccountSetting from "./pages/AccountSetting";
import AlbumDetail from "./pages/AlbumDetail";
import SignUp from "./pages/SignUp";
// 컴포넌트
import Header from "./components/Header";
import Intro from "./components/Intro";
import Footer from "./components/Footer";
// 전역 상태
import { AuthProvider } from "./contexts/AuthContext";
function Layout({ children }) {
  return (
    <div>
      <Header /> {/* 인트로 페이지를 제외한 모든 페이지에 헤더가 포함됨 */}
      <div className="inner">{children}</div>
      <Footer />
    </div>
  );
}

// React Query의 QueryClient 인스턴스 생성
const queryClient = new QueryClient();

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <title>MUSIC ON THE BLOCK</title>
          <Routes>
            <Route path="/" element={<Intro />} /> {/* 인트로에는 헤더 X */}
            <Route
              path="/Album"
              element={
                <Layout>
                  <Album />
                </Layout>
              }
            />
            <Route
              path="/Create"
              element={
                <Layout>
                  <Create />
                </Layout>
              }
            />
            <Route
              path="/my-page"
              element={
                <Layout>
                  <MyPage />
                </Layout>
              }
            />
            <Route
              path="/account-setting"
              element={
                <Layout>
                  <AccountSetting />
                </Layout>
              }
            />
            <Route
              path="/album-detail"
              element={
                <Layout>
                  <AlbumDetail />
                </Layout>
              }
            />
            <Route
              path="/sign-up"
              element={
                <Layout>
                  <SignUp />
                </Layout>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
