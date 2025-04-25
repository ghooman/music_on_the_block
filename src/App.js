import './App.css';
// 라이브러리
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// 페이지
import Album from './pages/Album';
import Create from './pages/Create';
import MyPage from './pages/MyPage';
import AccountSettings from './pages/AccountSettings';
import AlbumDetail from './pages/AlbumDetail';
import SignUp from './pages/SignUp';
import Nft from './pages/Nft';
import NftList from './pages/NftList';
import NftMintList from './pages/NftMintList';
import NftSellList from './pages/NftSellList';

// 컴포넌트
import Header from './components/Header';
import Intro from './components/Intro';
import Footer from './components/Footer';
// 전역 상태
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CollectionDetail from './pages/CollectionDetail';
import NftItemDetail from './pages/NftItemDetail';
import SongList from './pages/SongList';
import AlbumsDetail from './components/mypage/albums/AlbumsDetail';
import EditAlbumSongs from './components/mypage/albums/EditAlbumSongs';
import MintNftDetail from './components/nft/MintNftDetail';
import SellNftDetail from './components/nft/SellNftDetail';
function Layout({ children }) {
  return (
    <div>
      <Header /> {/* 인트로 페이지를 제외한 모든 페이지에 헤더가 포함됨 */}
      <div className="inner">{children}</div>
      <Footer />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

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
              path="main"
              element={
                <Layout>
                  <Album />
                </Layout>
              }
            />
            <Route
              path="/create"
              element={
                <Layout>
                  <Create />
                </Layout>
              }
            />
            <Route
              path="/song/list"
              element={
                <Layout>
                  <SongList />
                </Layout>
              }
            />
            <Route
              path="/my-page"
              element={
                <Layout>
                  <ProtectedRoute>
                    <MyPage isMyProfile={true} />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <MyPage isMyProfile={false} />
                </Layout>
              }
            />
            <Route
              path="/albums-detail/:id"
              element={
                <Layout>
                  {/* <ProtectedRoute> */}
                  <AlbumsDetail />
                  {/* </ProtectedRoute> */}
                </Layout>
              }
            />
            <Route
              path="/edit-album-songs/:id"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EditAlbumSongs />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/account-setting"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/song-detail/:id"
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
            <Route
              path="nft"
              element={
                <Layout>
                  <Nft />
                </Layout>
              }
            />
            <Route
              path="nft/list"
              element={
                <Layout>
                  <NftList />
                </Layout>
              }
            />
            <Route
              path="nft/mint/list"
              element={
                <Layout>
                  <NftMintList />
                </Layout>
              }
            />
            <Route
              path="mint/detail/:id"
              element={
                <Layout>
                  <MintNftDetail />
                </Layout>
              }
            />
            <Route
              path="nft/sell/list"
              element={
                <Layout>
                  <NftSellList />
                </Layout>
              }
            />
            <Route
              path="nft/sell/detail/:id"
              element={
                <Layout>
                  <SellNftDetail />
                </Layout>
              }
            />
            <Route
              path="nft/collection/detail"
              element={
                <Layout>
                  <CollectionDetail />
                </Layout>
              }
            />
            <Route
              path="nft/detail"
              element={
                <Layout>
                  <NftItemDetail />
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
