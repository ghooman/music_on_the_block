import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import reportWebVitals from './reportWebVitals';

// 두 개의 분리된 앱
import App from './App'; // 기존 앱 (App.css 사용)
import NodeApp from './NodeApp'; // 노드 앱 (NodeApp.css 사용)

// 자동재생 방지: 새로고침 시 무조건 false로 초기화
sessionStorage.setItem('preventAutoPlay', 'false');

const root = ReactDOM.createRoot(document.getElementById('root'));

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  // console.error = () => {};
}

// 최상위에서 라우팅 분기 - 여기서 CSS 분리
function Root() {
  return (
    <ThirdwebProvider>
      <BrowserRouter>
        <Routes>
          {/* 노드 관련 경로는 NodeApp */}
          <Route path="/affiliate/*" element={<NodeApp />} />

          {/* 나머지 모든 경로는 기존 App */}
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  );
}

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
