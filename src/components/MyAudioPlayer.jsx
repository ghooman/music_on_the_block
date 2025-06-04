// components/MyAudioPlayer.js
import React, { useContext, useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AuthContext } from '../contexts/AuthContext';
import { incrementPlayCount } from '../api/incrementPlayCount';
import VerticalVolumeControl from './VerticalVolumeControl';
import './VerticalVolumeControl.scss';
import { useAudio } from '../contexts/AudioContext';

const MyAudioPlayer = ({
  track,
  onTimeUpdate,
  onClickPrevious,
  onClickNext,
  getTracks,
  handleGetMusicList,
  setIsPlaying,
  audioRef,
  isVolumeHovered,
  setIsVolumeHovered,
}) => {
  const { token } = useContext(AuthContext);
  const { playKey, isMuted, volume } = useAudio();
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

    // 오디오 요소에 음소거 상태와 볼륨 적용
    setTimeout(() => {
      const audioElement = audioRef.current?.audio?.current;
      if (audioElement) {
        audioElement.muted = isMuted;
        audioElement.volume = volume;
      }
    }, 100);
  }, [track, setIsPlaying, isMuted, volume]);

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
      key={`${track?.id}-${playKey}`}
      src={track?.music_url}
      autoPlay
      loop={false}
      showSkipControls
      showJumpControls={false}
      showDownloadProgress={false}
      showVolumeControls={false}
      customVolumeControls={
        actualAudioElement
          ? [
              <VerticalVolumeControl
                key="vertical-volume"
                audioElement={actualAudioElement}
                isVolumeHovered={isVolumeHovered}
                setIsVolumeHovered={setIsVolumeHovered}
              />,
            ]
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
