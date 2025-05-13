// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { walletAddress, isRegistered } = useContext(AuthContext);

  // 지갑 연결이 안되어있거나 회원가입이 완료되지 않은 경우 접근 제한
  if (!walletAddress || !isRegistered) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
