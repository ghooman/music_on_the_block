// src/contexts/WebSocketContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const WS_ALBUM_URL = 'wss://muble.xyz/ws/album_status/';
  const WS_NFT_URL = 'wss://muble.xyz/ws/nft_status/';
  const RECONNECT_INTERVAL = 3000;

  const socketAlbumRef = useRef(null);
  const socketNftRef = useRef(null);

  const [lastAlbumMessage, setLastAlbumMessage] = useState(null);
  const [lastNftMessage, setLastNftMessage] = useState(null);

  const [isAlbumConnected, setIsAlbumConnected] = useState(false);
  const [isNftConnected, setIsNftConnected] = useState(false);

  const connectAlbumWebSocket = () => {
    if (socketAlbumRef.current?.readyState === WebSocket.OPEN) return;
    const socket = new WebSocket(WS_ALBUM_URL);
    socketAlbumRef.current = socket;

    socket.onopen = () => setIsAlbumConnected(true);
    socket.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        setLastAlbumMessage(data);
      } catch {}
    };
    socket.onerror = () => setIsAlbumConnected(false);
    socket.onclose = e => {
      setIsAlbumConnected(false);
      if (!e.wasClean) setTimeout(connectAlbumWebSocket, RECONNECT_INTERVAL);
    };
  };

  const connectNftWebSocket = () => {
    if (socketNftRef.current?.readyState === WebSocket.OPEN) return;
    const socket = new WebSocket(WS_NFT_URL);
    socketNftRef.current = socket;

    socket.onopen = () => setIsNftConnected(true);
    socket.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        setLastNftMessage(data);
      } catch {}
    };
    socket.onerror = () => setIsNftConnected(false);
    socket.onclose = e => {
      setIsNftConnected(false);
      if (!e.wasClean) setTimeout(connectNftWebSocket, RECONNECT_INTERVAL);
    };
  };

  useEffect(() => {
    connectAlbumWebSocket();
    connectNftWebSocket();
    return () => {
      socketAlbumRef.current?.close();
      socketNftRef.current?.close();
    };
  }, []);

  // 온라인 복구 처리 (선택)
  useEffect(() => {
    const handleOnline = () => {
      if (!isAlbumConnected) connectAlbumWebSocket();
      if (!isNftConnected) connectNftWebSocket();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isAlbumConnected, isNftConnected]);

  return (
    <WebSocketContext.Provider
      value={{
        albumSocket: socketAlbumRef.current,
        nftSocket: socketNftRef.current,
        lastAlbumMessage,
        lastNftMessage,
        isAlbumConnected,
        isNftConnected,
        connectAlbumWebSocket,
        connectNftWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
