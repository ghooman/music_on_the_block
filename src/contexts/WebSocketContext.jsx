import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const WS_URL = 'wss://muble.xyz/ws/album_status/';
  const RECONNECT_INTERVAL = 3000;

  const socketRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { walletAddress } = useContext(AuthContext);

  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return; // 이미 연결된 경우 새로 연결하지 않음
    }

    try {
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('웹소켓 연결됨');
        setIsConnected(true);
      };

      socket.onmessage = e => {
        try {
          const data = JSON.parse(e.data);
          console.log(data, '웹소켓 메시지');
          setLastMessage(data);
        } catch (err) {
          console.error('메시지 파싱 에러:', err);
        }
      };

      socket.onerror = err => {
        console.error('웹소켓 에러 발생:', err);
        setIsConnected(false);
      };

      socket.onclose = e => {
        console.error('웹소켓 연결 끊김:', e);
        setIsConnected(false);

        if (!e.wasClean) {
          setTimeout(() => connectWebSocket(), RECONNECT_INTERVAL);
        }
      };
    } catch (err) {
      console.error('웹소켓 연결 실패:', err);
      setTimeout(() => connectWebSocket(), RECONNECT_INTERVAL);
    }
  };

  useEffect(() => {
    connectWebSocket();

    // 컴포넌트 언마운트 시 소켓 연결 종료
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // 페이지 전환 시에도 웹소켓 유지를 위한 이벤트 핸들러
  useEffect(() => {
    const handleOnline = () => {
      if (!isConnected) {
        connectWebSocket();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isConnected]);

  return (
    <WebSocketContext.Provider
      value={{
        socket: socketRef.current,
        lastMessage,
        isConnected,
        connectWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
