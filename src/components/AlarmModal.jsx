// components/AlarmModal.js
import "./AlarmModal.scss";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import closeIcon from "../assets/images/close.svg";
import { AuthContext } from "../contexts/AuthContext";

// 환경변수를 통해 웹소켓 URL을 관리하도록 함 (환경변수 미설정 시 기본값 사용)
const WS_URL = "wss://muble.xyz/ws/album_status/";
const albumIdStorageKey = "generatedAlbumId";
// 재연결 시도 간격 (밀리초)
const RECONNECT_INTERVAL = 3000;

// getStoredAlbumData 함수 (id와 title 반환)
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
  const [albumPk, setAlbumPk] = useState(null); // 소켓에서 온 pk를 저장하는 상태 변수
  const [albumWalletAddress, setAlbumWalletAddress] = useState(null);
  const [storedAlbumData, setStoredAlbumData] = useState(getStoredAlbumData());
  const [isClosed, setIsClosed] = useState(false);

  const [isError, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // console.log("isError", isError);

  const socketRef = useRef(null);

  // 웹소켓 연결 및 이벤트 핸들러 등록 함수
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
        // 메시지 형식 및 상태 값 검증
        if (data && data.status) {
          if (data.status === "complt") {
            setAlbumPk(data.pk); // 소켓에서 받은 pk 저장
            setAlbumWalletAddress(data.wallet_address); // 소켓에서 받은 wallet_address 저장
            // 완료 상태이면 localStorage의 id를 삭제합니다.
            localStorage.removeItem(albumIdStorageKey);
            setStoredAlbumData(null);
          } else if (data.status === "fail") {
            setIsError(true);
            setErrorMessage(data.message.message);
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
      // 의도치 않은 종료일 경우 재연결 시도
      if (!e.wasClean) {
        setTimeout(() => {
          connectWebSocket();
        }, RECONNECT_INTERVAL);
      }
    };
  };

  const formatTime = (sec) => {
    const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer;

    // 성공 또는 실패하면 타이머 멈춤
    if (!isError && !albumPk) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isError, albumPk]);

  // 컴포넌트 마운트 시 웹소켓 연결 및 storedAlbumData 업데이트
  useEffect(() => {
    setStoredAlbumData(getStoredAlbumData());
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [location]);

  const handleClose = () => {
    setIsClosed(true);
  };

  const errorClose = () => {
    setAlbumPk(null);
    setStoredAlbumData(null);
    setIsError(false);
    setErrorMessage("");
    localStorage.removeItem(albumIdStorageKey);
  };

  const handleOverlayClick = () => {
    setIsClosed(false);
  };

  // 수정된 조건: 로컬 스토리지에 앨범 데이터가 있거나, 소켓에서 완료 정보가 온 상태에서
  // 현재 유저의 walletAddress와 소켓의 wallet_address가 일치하는 경우에만 모달을 렌더링
  const shouldRenderModal =
    storedAlbumData ||
    (albumPk && walletAddress?.address === albumWalletAddress);
  if (!shouldRenderModal) return null;

  console.log("isClosed", isClosed);
  console.log("storedAlbumData", storedAlbumData);
  console.log("albumPk", albumPk);
  console.log("walletAddress", walletAddress?.address);
  console.log("albumWalletAddress", albumWalletAddress);

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
                to={`/album-detail/${albumPk}`}
                onClick={() => setAlbumPk(null)}
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
