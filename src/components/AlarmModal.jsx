// components/AlarmModal.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./AlarmModal.scss";
import closeIcon from "../assets/images/close.svg";

// 환경변수를 통해 웹소켓 URL을 관리하도록 함 (환경변수 미설정 시 기본값 사용)
const WS_URL = "wss://muble.xyz/ws/album_status/";
// 재연결 시도 간격 (밀리초)
const RECONNECT_INTERVAL = 3000;

const AlarmModal = () => {
  // 처음에는 모달이 숨겨져 있다가 웹소켓 연결 시 또는 상태 업데이트 시 표시하도록 함
  const [isClosed, setIsClosed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [albumPk, setAlbumPk] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // 웹소켓 연결 및 이벤트 핸들러 등록 함수
  const connectWebSocket = () => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("웹 소켓 연결됨");
      setError(null);
      setLoading(true);
      setIsClosed(false);
    };

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("웹소켓", data);
        if (data && data.status) {
          if (data.status === "complt") {
            // 생성 완료 시점: 로딩 해제 및 pk 저장, 모달을 다시 열어 완료 메시지 표시
            setLoading(false);
            setAlbumPk(data.pk);
            setIsClosed(false);
          } else if (data.status === "processing") {
            // 생성 진행 중일 때: 모달이 열려있도록 처리
            setLoading(true);
            setIsClosed(false);
          } else if (data.status === "error") {
            setError("Song generation failed.");
            setIsClosed(false);
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
      setError("웹 소켓 에러 발생. 다시 연결 시도 중입니다.");
      setIsClosed(false);
    };

    socket.onclose = (e) => {
      console.error("웹 소켓 연결 끊김:", e);
      if (!e.wasClean) {
        setTimeout(() => {
          console.log("웹 소켓 재연결 시도...");
          connectWebSocket();
        }, RECONNECT_INTERVAL);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();
    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleOverlayClick = () => {
    // 오버레이 클릭 시 모달을 열어주는 처리 (완료 알람이 사라지지 않도록 함)
    setIsClosed(false);
  };

  console.log("현재 상태:", { loading, error, albumPk, isClosed });
  return (
    <>
      <div className={`alarm__modal ${isClosed ? "active" : ""}`}>
        <div className="alarm__modal__item">
          <button className="alarm__modal__item__closed" onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <p className="alarm__modal__item__title">ALARM</p>
          <p className="alarm__modal__item__txt">
            {error
              ? error
              : loading
              ? "AI song is currently being generated"
              : "Song generation completed!"}
          </p>
          {loading ? (
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
          ) : (
            albumPk && (
              <Link
                className="alarm__modal__item__link"
                to={`/album-detail/${albumPk}`}
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
