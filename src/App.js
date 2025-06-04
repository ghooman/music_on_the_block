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
import AlbumsEdit from './components/mypage/songs/AlbumsEdit';
import CollectionsEdit from './components/mypage/nfts/CollectionsEdit';

// 컴포넌트
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CollectionDetail from './pages/CollectionDetail';
import NftItemDetail from './pages/NftItemDetail';
import SongList from './pages/SongList';
import AlbumsDetail from './components/mypage/songs/AlbumsDetail';
import MintNftDetail from './components/nft/MintNftDetail';
import SellNftDetail from './components/nft/SellNftDetail';
import Evaluation from './pages/Evaluation';
import EvaluationBegin from './pages/EvaluationBegin';
import PlayerHeader from './components/PlayerHeader';
import AlarmModal from './components/AlarmModal';

// 전역 상태
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { AudioProvider } from './contexts/AudioContext';
import EvaluationResults from './pages/EvaluationResults';
import i18n from './i18n/i18n';
import GetDetail from './pages/GetDetail';

function Layout({ children }) {
  return (
    <>
      <div className="header-flex">
        <Header /> {/* 인트로 페이지를 제외한 모든 페이지에 헤더가 포함됨 */}
        <div className="inner">{children}</div>
      </div>
      <Footer />
      <PlayerHeader />
      <AlarmModal />
    </>
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
  const { language } = navigator;

  // console.log('navigator', navigator);

  useEffect(() => {
    if (language?.startsWith('ko')) {
      i18n.changeLanguage('한국어');
    } else {
      i18n.changeLanguage('English');
    }
  }, [language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <AudioProvider>
            <div className="App">
              <title>MUSIC ON THE BLOCK</title>
              <Routes>
                {/* <Route path="/" element={<Intro />} /> 인트로에는 헤더 X */}
                <Route
                  path="/"
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
                        {/* <EditAlbumSongs /> */}
                        <AlbumsEdit />
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
                  path="evaluation"
                  element={
                    <Layout>
                      <Evaluation />
                    </Layout>
                  }
                />
                <Route
                  path="evaluation-begin"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <EvaluationBegin />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="evaluation-results"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <EvaluationResults />
                      </ProtectedRoute>
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
                      <ProtectedRoute>
                        <NftMintList />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="nft/sell/list"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <NftSellList />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="mint/detail/:id/:nft_id/:status"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <MintNftDetail />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="nft/sell/details/:id/:nft_id"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <SellNftDetail />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="nft/collection/detail/:id"
                  element={
                    <Layout>
                      <CollectionDetail />
                    </Layout>
                  }
                />
                <Route
                  path="edit-collection-nfts/:id"
                  element={
                    <Layout>
                      <CollectionsEdit />
                    </Layout>
                  }
                />
                <Route
                  path="nft/detail/:id"
                  element={
                    <Layout>
                      <NftItemDetail />
                    </Layout>
                  }
                />
                {/* <Route
                  path="get/detail"
                  element={
                    <Layout>
                      <GetDetail />
                    </Layout>
                  }
                /> */}
              </Routes>
            </div>
          </AudioProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
