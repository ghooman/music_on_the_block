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
  const item = localStorage.getItem(albumIdStorageKey);
  if (!item) return null;
  try {
    const data = JSON.parse(item);
    if (data.expires < Date.now()) {
      localStorage.removeItem(albumIdStorageKey);
      return null;
    }
    return { id: data.id, title: data.title };
  } catch (e) {
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

  const socketRef = useRef(null);
  const hasTimerStartedRef = useRef(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const shouldRenderModal =
    storedAlbumData ||
    (albumPk && walletAddress?.address === albumWalletAddress);

  const formatTime = (sec) => {
    const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (
      storedAlbumData && // 타이머는 "생성 중"일 때만
      !isError &&
      !albumPk &&
      !hasTimerStartedRef.current
    ) {
      const storedStart = localStorage.getItem(albumTimerStorageKey);
      const startTime = storedStart ? parseInt(storedStart) : Date.now();
      if (!storedStart) {
        localStorage.setItem(albumTimerStorageKey, startTime.toString());
      }
      const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(diffSeconds);
      hasTimerStartedRef.current = true;
    }
  }, [storedAlbumData, isError, albumPk]);

  useEffect(() => {
    if (albumPk) {
      hasTimerStartedRef.current = false;
      localStorage.removeItem(albumTimerStorageKey);
    }
  }, [albumPk]);

  useEffect(() => {
    let timer;
    if (!albumPk) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [albumPk]);

  useEffect(() => {
    setStoredAlbumData(getStoredAlbumData());
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [location]);

  const connectWebSocket = () => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("웹 소켓 연결됨");
    };

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("웹소켓", data);
        if (data && data.status) {
          if (data.status === "complt") {
            setAlbumPk(data.pk);
            setAlbumWalletAddress(data.wallet_address);
            localStorage.removeItem(albumIdStorageKey);
            localStorage.removeItem(albumTimerStorageKey);
            setStoredAlbumData(null);
          } else if (data.status === "fail") {
            setAlbumPk(data.pk);
            setIsError(true);
            setErrorMessage(data.message.message);
            setAlbumWalletAddress(data.wallet_address);
            localStorage.removeItem(albumIdStorageKey);
            localStorage.removeItem(albumTimerStorageKey);
            setStoredAlbumData(null);
          } else {
            console.log("현재 상태:", data.status);
          }
        } else {
          console.warn("예상치 못한 메시지 형식:", e.data);
        }
      } catch (err) {
        console.error("메시지 파싱 에러:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("웹 소켓 에러 발생:", err);
    };

    socket.onclose = (e) => {
      console.error("웹 소켓 연결 끊김:", e);
      if (!e.wasClean) {
        setTimeout(() => {
          connectWebSocket();
        }, RECONNECT_INTERVAL);
      }
    };
  };

  const handleClose = () => {
    setIsClosed(true);
  };

  const errorClose = () => {
    setAlbumPk(null);
    setStoredAlbumData(null);
    setIsError(false);
    setErrorMessage("");
    setElapsedSeconds(0);
    localStorage.removeItem(albumIdStorageKey);
    localStorage.removeItem(albumTimerStorageKey);
  };

  const handleOverlayClick = () => {
    setIsClosed(false);
  };

  useEffect(() => {
    if (storedAlbumData && isError) {
      setIsError(false);
      setErrorMessage("");
      setElapsedSeconds(0);
      console.log("자동으로 isError 초기화됨");
    }
  }, [storedAlbumData]);

  useEffect(() => {
    console.log("isClosed", isClosed);
    console.log("storedAlbumData", storedAlbumData);
    console.log("albumPk", albumPk);
    console.log("walletAddress", walletAddress?.address);
    console.log("albumWalletAddress", albumWalletAddress);
  }, [isClosed, storedAlbumData, albumPk, walletAddress, albumWalletAddress]);

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
              "The generation process may take up to 5 minutes."
            )}
          </p>

          {!albumPk && !isError && (
            <div className="middle2">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
              <div className="bar bar4"></div>
              <div className="bar bar5"></div>
              <div className="bar bar6"></div>
              <div className="bar bar7"></div>
              <div className="bar bar8"></div>
            </div>
          )}
          {!isError && !albumPk && (
            <p className="alarm__modal__item__timer">
              {formatTime(elapsedSeconds)}
            </p>
          )}
          {isError ? (
            <button className="alarm__modal__item__link" onClick={errorClose}>
              OK
            </button>
          ) : (
            albumPk && (
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
