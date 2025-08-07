import './NodeApp.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 노드 레퍼럴 관련 페이지들만 import
import NodeLogin from './pages/Login';
import NodeSignUp from './pages/SignUp';
import NodeScrollToTop from './components/ScrollToTop';
import NodePrivateRoute from './components/routes/PrivateRoute';
import NodeProtectedRoutes from './components/routes/ProtectedRoutes';

// 노드 레퍼럴 전용 스타일들

import './node-referral/styles/Main.scss';

function NodeApp() {
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
