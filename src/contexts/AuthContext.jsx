// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [walletAddress, setWalletAddress] = useState(
    JSON.parse(localStorage.getItem('wallet_address')) || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('is_logged_in') === 'true');
  const [isRegistered, setIsRegistered] = useState(
    localStorage.getItem('is_registered') === 'true'
  );

  // 로컬스토리지 업데이트 함수
  const updateLocalStorage = useCallback((key, value) => {
    if (value === null) {
      localStorage.removeItem(key);
    } else if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }, []);

  // 상태 변경 시 로컬스토리지 업데이트
  useEffect(() => {
    updateLocalStorage('wallet_address', walletAddress);
  }, [walletAddress, updateLocalStorage]);

  useEffect(() => {
    updateLocalStorage('is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn, updateLocalStorage]);

  useEffect(() => {
    updateLocalStorage('is_registered', isRegistered ? 'true' : 'false');
  }, [isRegistered, updateLocalStorage]);

  // 페이지 로드 시 토큰이 있으면 자동 로그인 상태로 설정
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  // 로그인 상태와 지갑 주소가 업데이트되면 토큰 발급 API 호출
  useEffect(() => {
    if (isLoggedIn && walletAddress) {
      const getToken = async () => {
        try {
          const response = await axios.post(
            `${serverApi}/api/token?wallet_address=${walletAddress?.address}`
          );
          const receivedToken = response.data.token;
          setToken(receivedToken);
          // console.log("receivedToken:", receivedToken);
          localStorage.setItem('auth_token', receivedToken);
        } catch (error) {
          console.error('토큰 발급 에러:', error);
        }
      };
      getToken();
    }
  }, [isLoggedIn, walletAddress, serverApi]);

  // 토큰이 있으면 현재 사용자 정보를 가져와 회원가입 완료 여부를 확인
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${serverApi}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.name) {
            setIsRegistered(true);
          }
        } catch (error) {
          console.log('로그인 에러');
        }
      }
    };
    fetchUser();
  }, [token, serverApi]);

  // 로그아웃 함수: 모든 인증 관련 상태를 초기화합니다.
  const logout = useCallback(() => {
    setToken(null);
    setWalletAddress(null);
    setIsLoggedIn(false);
    setIsRegistered(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('is_registered');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn,
        walletAddress,
        setWalletAddress,
        isRegistered,
        setIsRegistered,
        logout, // 로그아웃 함수 추가
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
