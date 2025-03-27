// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const [token, setToken] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("walletAddress:", walletAddress);
  // 로그인 상태와 지갑 주소가 업데이트되면 토큰 발급 API 호출
  useEffect(() => {
    if (isLoggedIn && walletAddress) {
      const getToken = async () => {
        try {
          const response = await axios.post(
            `${serverApi}/api/token?wallet_address=${walletAddress}`
          );
          const receivedToken = response.data.token;
          setToken(receivedToken);
          console.log("receivedToken:", receivedToken);
          localStorage.setItem("auth_token", receivedToken);
        } catch (error) {
          console.error("토큰 발급 에러:", error);
        }
      };
      getToken();
    }
  }, [isLoggedIn, walletAddress]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn,
        walletAddress,
        setWalletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
