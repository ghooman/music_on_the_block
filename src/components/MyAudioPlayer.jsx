// components/MyAudioPlayer.js
import React, { useContext, useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AuthContext } from '../contexts/AuthContext';
import { incrementPlayCount } from '../api/incrementPlayCount';
import VerticalVolumeControl from './VerticalVolumeControl';
import './VerticalVolumeControl.scss'; // 반드시 임포트되어야 함

const MyAudioPlayer = ({
  track,
  onTimeUpdate,
  onClickPrevious,
  onClickNext,
  getTracks,
  handleGetMusicList,
  setIsPlaying,
  audioRef,
}) => {
  const { token } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const hasCountedRef = useRef(false);
  const [prevTime, setPrevTime] = useState(0);

  const handleListen = async e => {
    const currentTime = e.target.currentTime;
    if (currentTime < prevTime) {
      hasCountedRef.current = false;
    }
    setPrevTime(currentTime);

    if (!hasCountedRef.current && currentTime >= 90) {
      const success = await incrementPlayCount(track?.id, serverApi);
      if (success) {
        if (getTracks) getTracks();
        if (handleGetMusicList) handleGetMusicList();
      }
      hasCountedRef.current = true;
    }
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [track, setIsPlaying]);

  const handleEnded = () => {
    setIsPlaying(false);
    if (onClickNext) onClickNext();
  };

  // 실제 HTMLAudioElement 얻기
  const actualAudioElement =
    audioRef.current && audioRef.current.audio && audioRef.current.audio.current
      ? audioRef.current.audio.current
      : null;

  return (
    <AudioPlayer
      ref={audioRef}
      key={track?.id}
      src={track?.music_url}
      autoPlay
      loop={false}
      showSkipControls
      showJumpControls={false}
      showDownloadProgress={false}
      showVolumeControls={false}
      customVolumeControls={
        actualAudioElement
          ? [<VerticalVolumeControl key="vertical-volume" audioElement={actualAudioElement} />]
          : []
      }
      onPlay={handlePlay}
      onPause={handlePause}
      onListen={handleListen}
      listenInterval={1000}
      onEnded={handleEnded}
      onClickPrevious={onClickPrevious}
      onClickNext={onClickNext}
    />
  );
};

export default MyAudioPlayer;
