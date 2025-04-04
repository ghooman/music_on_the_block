// components/MyAudioPlayer.js
import React, { useContext, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import axios from "axios";
import "react-h5-audio-player/lib/styles.css";
import { AuthContext } from "../contexts/AuthContext";

const MyAudioPlayer = ({
  track,
  onTimeUpdate,
  onClickPrevious,
  onClickNext,
}) => {
  const { token } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  // hasCounted를 useRef로 관리하여 즉시 업데이트할 수 있도록 합니다.
  const hasCountedRef = useRef(false);
  const [prevTime, setPrevTime] = useState(0);

  const handleListen = async (e) => {
    const currentTime = e.target.currentTime;

    // 현재 재생 시간이 이전 재생 시간보다 작으면 hasCountedRef를 false로 설정
    if (currentTime < prevTime) {
      hasCountedRef.current = false;
    }
    setPrevTime(currentTime);

    // 아직 POST 요청을 보내지 않았고, 현재 재생 시간이 90초 이상이면 POST 요청 실행
    if (!hasCountedRef.current && currentTime >= 90) {
      try {
        await axios.post(`${serverApi}/api/music/${track?.id}/play`, {});
        console.log("POST 요청 성공");
      } catch (error) {
        console.error("POST 요청 실패", error);
      }
      hasCountedRef.current = true;
    }

    // 부모 컴포넌트로 재생 시간 업데이트 전달
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  };

  return (
    <AudioPlayer
      key={track?.id}
      src={track?.music_url}
      autoPlay={true}
      loop={true}
      showSkipControls={true}
      onPlay={() => console.log(`${track?.title} 재생 시작`)}
      onListen={handleListen}
      listenInterval={1000}
      onClickPrevious={onClickPrevious}
      onClickNext={onClickNext}
    />
  );
};

export default MyAudioPlayer;
