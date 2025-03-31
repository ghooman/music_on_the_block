// components/AlarmModal.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./AlarmModal.scss";
import closeIcon from "../assets/images/close.svg";

const WS_URL = "wss://muble.xyz/ws/album_status/";
const RECONNECT_INTERVAL = 3000;

const AlarmModal = () => {
  // alarmData에 서버에서 전달받은 데이터가 저장되고,
  // showAlarm은 모달 표시 여부를 제어합니다.
  const [alarmData, setAlarmData] = useState(null);
  const [showAlarm, setShowAlarm] = useState(false);
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
        if (data && data.status) {
          // 새 데이터가 들어오면 alarmData를 업데이트
          setAlarmData(data);
        } else {
          console.warn("예상치 못한 메시지 형식:", e.data);
        }
      } catch (err) {
        console.error("메시지 파싱 에러:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("웹 소켓 에러 발생:", err);
      setAlarmData({
        status: "error",
        message: "웹 소켓 에러 발생. 다시 연결 시도 중입니다.",
      });
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
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // alarmData가 업데이트되면 모달을 표시하도록 showAlarm 상태를 true로 전환
  useEffect(() => {
    if (alarmData !== null) {
      setShowAlarm(true);
    }
  }, [alarmData]);

  // 사용자가 모달을 닫으면 데이터를 초기화하여 모달이 사라집니다.
  const handleClose = () => {
    setShowAlarm(false);
    setAlarmData(null);
  };

  // 모달은 showAlarm이 true일 때만 렌더링합니다.
  if (!showAlarm || !alarmData) {
    return null;
  }

  return (
    <>
      <div className="alarm__modal active">
        <div className="alarm__modal__item">
          <button className="alarm__modal__item__closed" onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <p className="alarm__modal__item__title">ALARM</p>
          <p className="alarm__modal__item__txt">
            {alarmData.status === "complt"
              ? "Song generation completed!"
              : alarmData.status === "processing"
              ? "AI song is currently being generated"
              : alarmData.status === "error"
              ? alarmData.message
              : "알 수 없는 상태"}
          </p>
          {alarmData.status === "processing" && (
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
          {alarmData.status === "complt" && alarmData.pk && (
            <Link
              className="alarm__modal__item__link"
              to={`/album-detail/${alarmData.pk}`}
            >
              My Song Link
            </Link>
          )}
        </div>
      </div>
      <div className="alarm__modal__arr active" onClick={handleClose}></div>
    </>
  );
};

export default AlarmModal;
