// import './NodeApp.css';

import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

// 노드 레퍼럴 관련 페이지들만 import
import NodeLogin from './node-referral/pages/Login';
import NodeSignUp from './node-referral/pages/SignUp';
import NodeScrollToTop from './node-referral/components/ScrollToTop';
import NodePrivateRoute from './node-referral/components/routes/PrivateRoute';
import NodeProtectedRoutes from './node-referral/components/routes/ProtectedRoutes';

// 노드 레퍼럴 전용 스타일들

import './node-referral/styles/Main.scss';

function NodeApp() {
  useEffect(() => {
    // App.css 제거
    const appStyleLink = document.getElementById('app-styles');
    if (appStyleLink) {
      appStyleLink.remove();
    }

    // NodeApp.css 동적 로드
    const nodeStyleLink = document.createElement('link');
    nodeStyleLink.rel = 'stylesheet';
    nodeStyleLink.href = '/NodeApp.css';
    nodeStyleLink.id = 'nodeapp-styles';
    document.head.appendChild(nodeStyleLink);

    // 컴포넌트 언마운트 시 NodeApp.css 제거
    return () => {
      const styleLink = document.getElementById('nodeapp-styles');
      if (styleLink) {
        styleLink.remove();
      }
    };
  }, []);

  return (
    <div className="NodeApp">
      <NodeScrollToTop />
      <Routes>
        <Route path="/login" element={<NodeLogin />} />
        <Route path="/signup" element={<NodeSignUp />} />

        <Route
          path="/*"
          element={
            <NodePrivateRoute>
              <NodeProtectedRoutes />
            </NodePrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default NodeApp;
