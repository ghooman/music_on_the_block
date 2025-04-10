// components/AlarmModal.js
import "./AlarmModal.scss";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import closeIcon from "../assets/images/close.svg";
import { AuthContext } from "../contexts/AuthContext";

const WS_URL = "wss://muble.xyz/ws/album_status/";
const albumIdStorageKey = "generatedAlbumId";
const albumTimerStorageKey = "generatedAlbumTimerStart";
const RECONNECT_INTERVAL = 3000;

const getStoredAlbumData = () => {
  try {
    const item = localStorage.getItem(albumIdStorageKey);
    if (!item) return null;
    const data = JSON.parse(item);
    if (data.expires < Date.now()) {
      localStorage.removeItem(albumIdStorageKey);
      return null;
    }
    return { id: data.id, title: data.title };
  } catch {
    localStorage.removeItem(albumIdStorageKey);
    return null;
  }
};

const AlarmModal = () => {
  const { walletAddress } = useContext(AuthContext);
  const location = useLocation();

  const [albumPk, setAlbumPk] = useState(null);
  const [albumWalletAddress, setAlbumWalletAddress] = useState(null);
  const [storedAlbumData, setStoredAlbumData] = useState(getStoredAlbumData());
  const [isClosed, setIsClosed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const socketRef = useRef(null);
  const hasTimerStartedRef = useRef(false);

  const shouldRenderModal =
    storedAlbumData ||
    (albumPk && walletAddress?.address === albumWalletAddress);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  useEffect(() => {
    if (
      storedAlbumData &&
      !isError &&
      !albumPk &&
      !hasTimerStartedRef.current
    ) {
      const storedStart = localStorage.getItem(albumTimerStorageKey);
      const startTime = storedStart ? parseInt(storedStart) : Date.now();
      if (!storedStart)
        localStorage.setItem(albumTimerStorageKey, startTime.toString());
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      hasTimerStartedRef.current = true;
    }
  }, [storedAlbumData, isError, albumPk]);

  useEffect(() => {
    let timer;
    if (storedAlbumData && !albumPk && !isError) {
      timer = setInterval(() => {
        const storedStart = parseInt(
          localStorage.getItem(albumTimerStorageKey)
        );
        const diffSeconds = Math.floor((Date.now() - storedStart) / 1000);
        setElapsedSeconds(diffSeconds);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [storedAlbumData, albumPk, isError]);

  useEffect(() => {
    if (albumPk || isError) {
      hasTimerStartedRef.current = false;
      localStorage.removeItem(albumTimerStorageKey);
    }
  }, [albumPk, isError]);

  useEffect(() => {
    setStoredAlbumData(getStoredAlbumData());
    connectWebSocket();
    return () => socketRef.current?.close();
  }, [location]);

  const connectWebSocket = () => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => console.log("웹 소켓 연결됨");

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("웹소켓", data);
        if (!data?.status) return;

        if (data.status === "complt" || data.status === "fail") {
          setAlbumPk(data.pk);
          setAlbumWalletAddress(data.wallet_address);
          localStorage.removeItem(albumIdStorageKey);
          localStorage.removeItem(albumTimerStorageKey);
          setStoredAlbumData(null);

          if (data.status === "fail") {
            setIsError(true);
            setErrorMessage(data.message?.message || "Unknown error");
          }
        } else {
          console.log("현재 상태:", data.status);
        }
      } catch (err) {
        console.error("메시지 파싱 에러:", err);
      }
    };

    socket.onerror = (err) => console.error("웹 소켓 에러 발생:", err);

    socket.onclose = (e) => {
      console.error("웹 소켓 연결 끊김:", e);
      if (!e.wasClean) {
        setTimeout(() => connectWebSocket(), RECONNECT_INTERVAL);
      }
    };
  };

  const handleClose = () => setIsClosed(true);
  const handleOverlayClick = () => setIsClosed(false);
  const errorClose = () => {
    setAlbumPk(null);
    setStoredAlbumData(null);
    setIsError(false);
    setErrorMessage("");
    setElapsedSeconds(0);
    localStorage.removeItem(albumIdStorageKey);
    localStorage.removeItem(albumTimerStorageKey);
  };

  useEffect(() => {
    if (storedAlbumData && isError) {
      console.log("자동으로 isError 초기화됨");
      setIsError(false);
      setErrorMessage("");
      setElapsedSeconds(0);
    }
  }, [storedAlbumData]);

  if (!shouldRenderModal) return null;

  return (
    <>
      <div className={`alarm__modal ${isClosed ? "active" : ""}`}>
        <div className="alarm__modal__item">
          <button className="alarm__modal__item__closed" onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <p className="alarm__modal__item__title">
            {storedAlbumData?.title || "AI Song Generation"}
          </p>
          <p
            className={`alarm__modal__item__txt ${
              isError ? "alarm__modal__item__txt--error" : ""
            }`}
          >
            {isError ? (
              <>
                <span className="err-txt">Music generation failed.</span> <br />
                <br />
                <span className="err-txt">{errorMessage}</span>
              </>
            ) : albumPk ? (
              "Song generation completed!"
            ) : (
              "The generation process may take up to 10 minutes."
            )}
          </p>

          {!isError && storedAlbumData && (
            <>
              <div className="middle2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`bar bar${i + 1}`}></div>
                ))}
              </div>
              <p className="alarm__modal__item__timer">
                {formatTime(elapsedSeconds)}
              </p>
            </>
          )}

          {isError ? (
            <button className="alarm__modal__item__link" onClick={errorClose}>
              OK
            </button>
          ) : (
            albumPk &&
            !storedAlbumData && (
              <Link
                className="alarm__modal__item__link"
                to={`/song-detail/${albumPk}`}
                onClick={() => {
                  setAlbumPk(null);
                  setElapsedSeconds(0);
                }}
              >
                My Song Link
              </Link>
            )
          )}
        </div>
      </div>
      <div
        className={`alarm__modal__arr ${isClosed ? "active" : ""}`}
        onClick={handleOverlayClick}
      ></div>
    </>
  );
};

export default AlarmModal;
